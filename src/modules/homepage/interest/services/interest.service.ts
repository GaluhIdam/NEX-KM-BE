import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { InterestServiceInterface } from '../interfaces/interest.service.interface';
import { Interest } from '@prisma/clients/homepage';
import { InterestDTO } from '../dtos/interest.dto';

@Injectable()
export class InterestService
  extends AppError
  implements InterestServiceInterface
{
  constructor(private readonly prisma: PrismaHomepageService) {
    super(InterestService.name);
  }

  //Get Interest By Uuid
  async getInterestByUuid(uuid: string): Promise<Interest> {
    const findData = await this.prisma.interest.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Interest');
    return findData;
  }

  //Get Interest
  async getInterest(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Interest[]>> {
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

    const result = await this.prisma.interest.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
      take: take,
      skip: skip,
      orderBy: by_order,
    });
    this.handlingErrorEmptyData(result, 'interest');
    const total = await this.prisma.interest.count({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
    });

    const data: ResponseDTO<Interest[]> = {
      result: result,
      total: total,
    };
    return data;
  }

  //Create Interest
  async createInterest(dto: InterestDTO): Promise<Interest> {
    return await this.prisma.interest.create({
      data: {
        ...dto,
      },
    });
  }

  //Update Interest
  async updateInterest(uuid: string, dto: InterestDTO): Promise<Interest> {
    const findData = await this.prisma.interest.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'interest');
    return await this.prisma.interest.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...dto,
      },
    });
  }

  //Delete Interest
  async deleteInterest(uuid: string): Promise<Interest> {
    const findData = await this.prisma.interest.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'interest');
    return await this.prisma.interest.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
