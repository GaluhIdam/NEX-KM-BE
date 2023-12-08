import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { SharingExpServiceInterface } from '../interfaces/sharing-exp.service.interface';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import { SharingExp } from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { SharingExpDTO, SharingExpStatusDTO } from '../dtos/sharing-exp.dto';

@Injectable()
export class SharingExpService
  extends AppError
  implements SharingExpServiceInterface
{
  constructor(private readonly prisma: PrismaHomepageService) {
    super(SharingExpService.name);
  }

  //Get Sharing Exp By Uuid
  async getSharingExpByUuid(uuid: string): Promise<SharingExp> {
    const findData = await this.prisma.sharingExp.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'sharing experience');
    return findData;
  }

  //Get Sharing Exp
  async getSharingExp(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    isAdmin: boolean,
    personalNumber?: string,
  ): Promise<ResponseDTO<SharingExp[]>> {
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

    let where = {};

    const filters = [];

    //search
    filters.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { place: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        {
          AND: [
            { title: { contains: search, mode: 'insensitive' } },
            { place: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      ],
    });

    if (personalNumber) {
      filters.push({ personalNumber: personalNumber });
    }

    if (!isAdmin) {
      filters.push({ approvalStatus: true });
    }

    if (filters.length > 0) {
      where = { AND: filters };
    }

    const result = await this.prisma.sharingExp.findMany({
      where: where,
      take: take,
      skip: skip,
      orderBy: by_order,
    });
    this.handlingErrorEmptyData(result, 'sharing experinece');

    const data: ResponseDTO<SharingExp[]> = {
      result: result,
      total: result.length,
    };
    return data;
  }

  //Create Sharing Exp
  async createSharingExp(dto: SharingExpDTO): Promise<SharingExp> {
    return await this.prisma.sharingExp.create({
      data: {
        ...dto,
      },
    });
  }

  //Update Sharing Exp
  async updateSharingExp(
    uuid: string,
    dto: SharingExpDTO,
  ): Promise<SharingExp> {
    const findData = await this.prisma.sharingExp.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'sharing experience');
    return await this.prisma.sharingExp.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...dto,
      },
    });
  }

  //Delete Sharing Exp
  async deleteSharingExp(uuid: string): Promise<SharingExp> {
    const findData = await this.prisma.sharingExp.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'sharing experience');
    return await this.prisma.sharingExp.delete({
      where: {
        uuid: uuid,
      },
    });
  }

  //Approval or Reject Status
  async appproveReject(
    uuid: string,
    dto: SharingExpStatusDTO,
  ): Promise<SharingExp> {
    const findData = await this.prisma.sharingExp.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'sharing experience');
    return await this.prisma.sharingExp.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...dto,
      },
    });
  }
}
