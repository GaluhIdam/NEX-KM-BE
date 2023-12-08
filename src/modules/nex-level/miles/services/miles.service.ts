import { parse } from './../../../../../node_modules/postcss/lib/postcss.d';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MilesServiceInterface } from '../interface/miles.services.interface';
import { Miles } from '@prisma/clients/nex-level';
import { MilesDTO } from '../dtos/miles.dto';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { AppError } from 'src/core/errors/app.error';
import { unlinkSync } from 'fs';

@Injectable()
export class MilesService extends AppError implements MilesServiceInterface {
  constructor(private readonly prisma: PrismaLevelService) {
    super(MilesService.name);
  }

  async getAllMiles(): Promise<ResponseDTO<Miles[]>> {
    const result = await this.prisma.miles.findMany();
    this.handlingErrorEmptyData(result, 'miles');
    const total = await this.prisma.miles.count();
    const data: ResponseDTO<Miles[]> = {
      result: result,
      total: total,
    };
    return data;
  }

  async getMilesByUuid(uuid: string): Promise<MilesDTO> {
    const findData = await this.prisma.miles.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'mile');
    return findData;
  }

  async getMiles(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Miles[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

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
    const result = await this.prisma.miles.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          {
            AND: [
              { name: { contains: search, mode: 'insensitive' } },
              { category: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      },
      orderBy: orderBy,
      take: take,
      skip: skip,
    });

    this.handlingErrorEmptyData(result, 'Miles');

    const total = await this.prisma.miles.count({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          {
            AND: [
              { name: { contains: search, mode: 'insensitive' } },
              { category: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      },
    });

    const data: ResponseDTO<Miles[]> = {
      result: result,
      total: total,
    };
    return data;
  }

  async createMiles(dto: MilesDTO): Promise<MilesDTO> {
    return await this.prisma.miles.create({
      data: {
        ...dto,
      },
    });
  }

  async updateMilesByUUID(uuid: string, dto: MilesDTO): Promise<MilesDTO> {
    const findData = await this.prisma.miles.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'miles');
    unlinkSync(`./uploads/${findData.path}`);
    return await this.prisma.miles.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteMilesByUUID(uuid: string): Promise<MilesDTO> {
    const findData = await this.prisma.miles.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'miles');
    unlinkSync(`./uploads/${findData.path}`);

    return await this.prisma.miles.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
