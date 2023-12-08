import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { TalkCategoryServiceInterface } from '../interfaces/talk-category.service.interface';
import { TalkCategory } from '@prisma/clients/nex-talk';
import { TalkCategoryDTO } from '../dtos/talk-category.dto';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
import { TalkCategoryStatusDTO } from '../dtos/talk-category-status.dto';

@Injectable()
export class TalkCategoryService
  extends AppError
  implements TalkCategoryServiceInterface
{
  constructor(private readonly prisma: PrismaTalkService) {
    super(TalkCategoryService.name);
  }

  //Get Talk Category
  async getTalkCategory(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    status?: boolean,
  ): Promise<PaginationDTO<TalkCategory[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const by_order = {};

    if (sortBy == 'desc' || sortBy == 'asc') {
      by_order['createdAt'] = sortBy;
    }

    let where = {};

    const filters = [];

    if (status !== null) {
      filters.push({ status: status });
    }

    if (search) {
      filters.push({
        name: { contains: search, mode: 'insensitive' },
      });
    }

    if (filters.length > 0) {
      where = { AND: filters };
    }

    const result = await this.prisma.talkCategory.findMany({
      where: where,
      take: take,
      skip: skip,
      orderBy: by_order,
      include: {
        forums: true,
        creators: {
          include: {
            series: {
              include: {
                seriesPodcast: true,
              },
            },
          },
        },
        streams: true,
      },
    });

    const totalItems = await this.prisma.talkCategory.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<TalkCategory[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Talk Category');
    return response;
  }

  //Get talk Category By uuid
  async getTalkCategoryById(uuid: string): Promise<TalkCategory> {
    const result = await this.prisma.talkCategory.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        forums: true,
        creators: {
          include: {
            series: {
              include: {
                seriesPodcast: true,
              },
            },
          },
        },
        streams: true,
      },
    });
    this.handlingErrorNotFound(result, uuid, 'Talk Category');
    return result;
  }

  //Create Talk Category
  async createTalkCategory(dto: TalkCategoryDTO): Promise<TalkCategory> {
    return await this.prisma.talkCategory.create({
      data: {
        name: dto.name,
        status: true,
      },
    });
  }

  //Update Talk Category
  async updateTalkCategory(
    uuid: string,
    dto: TalkCategoryDTO,
  ): Promise<TalkCategory> {
    const findData = await this.prisma.talkCategory.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Talk Category');
    return await this.prisma.talkCategory.update({
      where: {
        uuid: uuid,
      },
      data: {
        name: dto.name,
      },
    });
  }

  //Delete Talk Category
  async deleteTalkCategory(uuid: string): Promise<TalkCategory> {
    const findData = await this.prisma.talkCategory.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Talk Category');
    return await this.prisma.talkCategory.delete({
      where: {
        uuid: uuid,
      },
    });
  }

  //Update Status Talk Category
  async updateTalkCategoryStatus(
    uuid: string,
    dto: TalkCategoryStatusDTO,
  ): Promise<TalkCategory> {
    const findData = await this.prisma.talkCategory.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Talk Category');
    return await this.prisma.talkCategory.update({
      where: {
        uuid: uuid,
      },
      data: {
        status: dto.status,
      },
    });
  }
}
