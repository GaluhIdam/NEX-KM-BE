import { BadRequestException, Injectable } from '@nestjs/common';
import { PointConfigServiceInterface } from '../interface/point-config.services.interface';
import { PointConfig } from '@prisma/clients/nex-level';
import { PointConfigDTO } from '../dtos/point-config.dto';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';
import { AppError } from 'src/core/errors/app.error';
import { ResponseDTO } from 'src/core/dtos/response.dto';

@Injectable()
export class PointConfigService
  extends AppError
  implements PointConfigServiceInterface
{
  constructor(private readonly prisma: PrismaLevelService) {
    super(PointConfigService.name);
  }

  //Get Point Config Base On Activity
  async getPointConfigByActivity(activity: string): Promise<PointConfigDTO> {
    const findData = await this.prisma.pointConfig.findFirst({
      where: {
        activity: activity,
      },
    });
    return findData;
  }

  //Get Point Config Base On UUid
  async getPointConfigByUUID(uuid: string): Promise<PointConfigDTO> {
    const findData = await this.prisma.pointConfig.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'point config');
    return findData;
  }

  //Get Point Config with Pagination
  async getPointConfig(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<PointConfig[]>> {
    const orderBy = [];

    if (sortBy.toLocaleLowerCase() === 'asc') {
      orderBy.push({
        createdAt: 'asc',
      });
    }

    if (sortBy.toLocaleLowerCase() === 'desc') {
      orderBy.push({
        createdAt: 'desc',
      });
    }
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const result = await this.prisma.pointConfig.findMany({
      where: {
        OR: [
          { activity: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          {
            AND: [
              { activity: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      },
      orderBy: orderBy,
      take: take,
      skip: skip,
    });
    this.handlingErrorEmptyData(result, 'point config');

    const total = await this.prisma.pointConfig.count({
      where: {
        OR: [
          { activity: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { point: Number(search) },
          {
            AND: [
              { activity: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
              { point: Number(search) },
            ],
          },
        ],
      },
    });
    const data: ResponseDTO<PointConfig[]> = {
      result: result,
      total: total,
    };

    return data;
  }

  //Create Point Config
  async createPointConfig(dto: PointConfigDTO): Promise<PointConfigDTO> {
    return await this.prisma.pointConfig.create({
      data: {
        ...dto,
      },
    });
  }

  //Update Point Config
  async updatePointConfigByUUID(
    uuid: string,
    dto: PointConfigDTO,
  ): Promise<PointConfigDTO> {
    const findData = await this.prisma.pointConfig.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'point config');
    return await this.prisma.pointConfig.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...dto,
      },
    });
  }

  //Delete Point Config
  async deletePointConfigByUUID(uuid: string): Promise<PointConfigDTO> {
    const findData = await this.prisma.pointConfig.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'point config');
    return await this.prisma.pointConfig.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
