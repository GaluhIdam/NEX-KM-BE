import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import { SkillServiceInterface } from '../interfaces/skill.service.interface';
import { Skill } from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { SkillDTO } from '../dtos/skill.dto';

@Injectable()
export class SkillService extends AppError implements SkillServiceInterface {
  constructor(private prisma: PrismaHomepageService) {
    super(SkillService.name);
  }

  //Get Skill
  async getSkill(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Skill[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const by_order = [];

    if (sortBy === 'desc') {
      by_order.push({
        createdAt: 'desc',
      });
    }
    if (sortBy === 'asc') {
      by_order.push({
        createdAt: 'asc',
      });
    }

    const result = await this.prisma.skill.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
      take: take,
      skip: skip,
      orderBy: by_order,
    });
    this.handlingErrorEmptyData(result, 'skill');
    const total = await this.prisma.skill.count({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
    });

    const data: ResponseDTO<Skill[]> = {
      result: result,
      total: total,
    };
    return data;
  }

  //Get Skill By Uuid
  async getSkillByUuid(uuid: string): Promise<Skill> {
    const findData = await this.prisma.skill.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'skill');
    return findData;
  }

  //Create Skill
  async createSkill(dto: SkillDTO): Promise<Skill> {
    return await this.prisma.skill.create({
      data: {
        ...dto,
      },
    });
  }

  //Update Skill
  async updateSkill(uuid: string, dto: SkillDTO): Promise<Skill> {
    const findData = await this.prisma.skill.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'skill');
    return await this.prisma.skill.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...dto,
      },
    });
  }

  //Delete Skill
  async deleteSkill(uuid: string): Promise<Skill> {
    const findData = await this.prisma.skill.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'skill');
    return await this.prisma.skill.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
