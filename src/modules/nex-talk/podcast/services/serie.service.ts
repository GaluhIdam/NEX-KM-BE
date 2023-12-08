import { unlinkSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { SerieServiceInterface } from '../interfaces/serie.service.interface';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { Serie } from '@prisma/clients/nex-talk';
import { SerieDTO } from '../dtos/serie.dto';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';
import { SerieStatusDTO } from '../dtos/serie-status.dto';
import { SerieStatusApprovalDTO } from '../dtos/serie-status-approval.dto';
import { SerieEditorChoiceDTO } from '../dtos/serie-editor-choice.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';
import calculateStatisticPercentage from 'src/core/utility/statistic-percentage-util';

@Injectable()
export class SerieService extends AppError implements SerieServiceInterface {
  constructor(private readonly prisma: PrismaTalkService) {
    super(SerieService.name);
  }

  //Get Series
  async getSeries(
    page: number,
    limit: number,
    search?: string,
    order_by?: string,
    personal_number?: string,
    status?: boolean,
    creatorId?: number,
    approval_status?: string,
  ): Promise<PaginationDTO<Serie[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const by_order = {};
    if (order_by == 'desc' || order_by == 'asc') {
      by_order['createdAt'] = order_by;
    }

    let where = {};

    const filters = [];

    if (creatorId) {
      filters.push({ creatorId: creatorId });
    }

    if (personal_number) {
      filters.push({ personalNumber: personal_number });
    }

    if (status != null) {
      filters.push({ status: status });
    }

    if (approval_status) {
      filters.push({ approvalStatus: approval_status });
    }

    if (search) {
      filters.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          {
            AND: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      });
    }

    if (filters.length > 0) {
      where = { AND: filters };
    }

    const result = await this.prisma.serie.findMany({
      where: where,
      take: take,
      skip: skip,
      orderBy: by_order,
      include: {
        creator: {
          select: {
            uuid: true,
            name: true,
            personalNumber: true,
            createdBy: true,
            unit: true,
            talkCategory: {
              select: {
                uuid: true,
                name: true,
              },
            },
          },
        },
        seriesPodcast: {
          select: {
            uuid: true,
            title: true,
            likeCount: true,
            approvalStatus: true,
          },
        },
      },
    });

    const totalItems = await this.prisma.serie.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<Serie[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Serie');
    return response;
  }

  //Get Serie Statistic
  async getSerieStatistic(): Promise<StatisticDTO> {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const firstDayOfBeforeMonth = new Date(currentYear, currentMonth - 2, 1);
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const firstDayOfNextMonth = new Date(currentYear, currentMonth, 1);

    const allSeries = await this.getAllSeries();
    const needApprovalSeries = await this.getSeriesByApprovalStatus(
      'Waiting Approval',
    );
    const publishedSeries = await this.getSeriesByApprovalStatus('Approved');
    const currentMonthSeries = await this.getSeriesByCreatedAtRange(
      firstDayOfMonth,
      firstDayOfNextMonth,
    );
    const beforeMonthSeries = await this.getSeriesByCreatedAtRange(
      firstDayOfBeforeMonth,
      firstDayOfMonth,
    );

    const isCurrentMonthGreaterThanBeforeMonth =
      currentMonthSeries.length >= beforeMonthSeries.length;

    const response: StatisticDTO = {
      totalAllCreations: allSeries.length,
      totalCreationCurrentMonth: currentMonthSeries.length,
      totalCreationBeforeMonth: beforeMonthSeries.length,
      totalCreationPublished: publishedSeries.length,
      totalCreationNeedApproval: needApprovalSeries.length,
      isCurrentMonthGreaterThanBeforeMonth:
        isCurrentMonthGreaterThanBeforeMonth,
      totalCurrentMonthPersentage: calculateStatisticPercentage(
        isCurrentMonthGreaterThanBeforeMonth,
        currentMonthSeries.length,
        beforeMonthSeries.length,
      ),
    };

    return response;
  }

  //Get Serie By uuid
  async getSerieByUuid(uuid: string): Promise<Serie> {
    const result = await this.prisma.serie.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        creator: {
          include: {
            talkCategory: true,
          },
        },
        seriesPodcast: true,
      },
    });
    this.handlingErrorNotFound(result, uuid, 'Serie');
    return result;
  }

  //Create Serie
  async createSeries(dto: SerieDTO): Promise<Serie> {
    try {
      const findCreatorData = await this.prisma.creator.findFirst({
        where: {
          id: dto.creatorId,
        },
      });
      this.handlingErrorNotFound(findCreatorData, dto.creatorId, 'Creator');

      return await this.prisma.serie.create({
        data: {
          creatorId: dto.creatorId,
          title: dto.title,
          description: dto.description,
          image: dto.image,
          path: dto.path,
          approvalStatus: 'Waiting Approval',
          approvalMessage: '',
          approvalBy: '',
          status: true,
          likeCount: 0,
          editorChoice: false,
          personalNumber: dto.personalNumber,
        },
      });
    } catch (error) {
      unlinkSync(`./uploads/${dto.path}`);
      throw error;
    }
  }

  //Update Series
  async updateSeries(uuid: string, dto: SerieDTO): Promise<Serie> {
    try {
      const findData = await this.prisma.serie.findFirst({
        where: {
          uuid: uuid,
        },
      });
      this.handlingErrorNotFound(findData, uuid, 'Series');

      const findCreatorData = await this.prisma.creator.findFirst({
        where: {
          id: dto.creatorId,
        },
      });
      this.handlingErrorNotFound(findCreatorData, dto.creatorId, 'Creator');

      unlinkSync(`./uploads/${findData.path}`);

      return await this.prisma.serie.update({
        where: {
          uuid: uuid,
        },
        data: {
          creatorId: dto.creatorId,
          title: dto.title,
          description: dto.description,
          image: dto.image,
          path: dto.path,
          personalNumber: dto.personalNumber,
        },
      });
    } catch (error) {
      unlinkSync(`./uploads/${dto.path}`);
      throw error;
    }
  }

  //Delete Series
  async deleteSeries(uuid: string): Promise<Serie> {
    const findData = await this.prisma.serie.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Series');
    unlinkSync(`./uploads/${findData.path}`);
    return await this.prisma.serie.delete({
      where: {
        uuid: uuid,
      },
    });
  }

  //Update Status Serie
  async updateSerieStatus(uuid: string, dto: SerieStatusDTO): Promise<Serie> {
    const findData = await this.prisma.serie.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Serie');
    return await this.prisma.serie.update({
      where: {
        uuid: uuid,
      },
      data: {
        status: dto.status,
      },
    });
  }

  //Update Serie Status Approval
  async updateSerieStatusApproval(
    uuid: string,
    dto: SerieStatusApprovalDTO,
  ): Promise<Serie> {
    const findData = await this.prisma.serie.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Serie');
    return await this.prisma.serie.update({
      where: {
        uuid: uuid,
      },
      data: {
        approvalStatus: dto.approvalStatus,
        approvalMessage: dto.approvalMessage ?? '',
        approvalBy: dto.approvalBy,
      },
    });
  }

  //Update Editor Choice Serie
  async updateSerieEditorChoice(
    uuid: string,
    dto: SerieEditorChoiceDTO,
  ): Promise<Serie> {
    const findData = await this.prisma.serie.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Serie');
    return await this.prisma.serie.update({
      where: {
        uuid: uuid,
      },
      data: {
        editorChoice: dto.editorChoice,
      },
    });
  }

  private async getAllSeries(): Promise<Serie[]> {
    return this.prisma.serie.findMany();
  }

  private async getSeriesByApprovalStatus(
    approvalStatus: string,
  ): Promise<Serie[]> {
    return this.prisma.serie.findMany({
      where: {
        approvalStatus,
      },
    });
  }

  private async getSeriesByCreatedAtRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Serie[]> {
    return this.prisma.serie.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  }
}
