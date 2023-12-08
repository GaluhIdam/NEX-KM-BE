import { unlinkSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { CreatorServiceInterface } from '../interfaces/creator.service.interface';
import { Creator } from '@prisma/clients/nex-talk';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';
import { CreatorDTO } from '../dtos/creator.dto';
import { CreatorStatusApprovalDTO } from '../dtos/creator-status-approval.dto';
import { CreatorStatusDTO } from '../dtos/creator-status.dto';
import { CreatorEditorChoiceDTO } from '../dtos/creator-editor-choice.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';
import calculateStatisticPercentage from 'src/core/utility/statistic-percentage-util';

@Injectable()
export class CreatorService
  extends AppError
  implements CreatorServiceInterface
{
  constructor(private readonly prisma: PrismaTalkService) {
    super(CreatorService.name);
  }

  //Get Creators
  async getCreators(
    page: number,
    limit: number,
    search?: string,
    order_by?: string,
    personal_number?: string,
    approval_status?: string,
    status?: boolean,
  ): Promise<PaginationDTO<Creator[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const by_order = {};
    if (order_by == 'desc' || order_by == 'asc') {
      by_order['createdAt'] = order_by;
    }

    let where = {};

    const filters = [];

    if (status !== null) {
      filters.push({ status: status });
    }

    if (personal_number) {
      filters.push({ personalNumber: personal_number });
    }

    if (approval_status) {
      filters.push({ approvalStatus: approval_status });
    }

    if (search) {
      filters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          {
            AND: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      });
    }

    if (filters.length > 0) {
      where = { AND: filters };
    }

    const result = await this.prisma.creator.findMany({
      where: where,
      take: take,
      skip: skip,
      orderBy: by_order,
      include: {
        talkCategory: {
          select: {
            uuid: true,
            name: true,
          },
        },
        series: {
          select: {
            uuid: true,
            title: true,
            likeCount: true,
            approvalStatus: true,
            seriesPodcast: {
              select: {
                uuid: true,
                title: true,
                likeCount: true,
                approvalStatus: true,
              },
            },
          },
        },
      },
    });

    const totalItems = await this.prisma.creator.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<Creator[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Creator');
    return response;
  }

  //Get Creator Statistic
  async getCreatorStatistic(): Promise<StatisticDTO> {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const firstDayOfBeforeMonth = new Date(currentYear, currentMonth - 2, 1);
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const firstDayOfNextMonth = new Date(currentYear, currentMonth, 1);

    const allCreators = await this.getAllCreators();
    const needApprovalCreators = await this.getCreatorsByApprovalStatus(
      'Waiting Approval',
    );
    const publishedCreators = await this.getCreatorsByApprovalStatus(
      'Approved',
    );
    const currentMonthCreators = await this.getCreatorsByCreatedAtRange(
      firstDayOfMonth,
      firstDayOfNextMonth,
    );
    const beforeMonthCreators = await this.getCreatorsByCreatedAtRange(
      firstDayOfBeforeMonth,
      firstDayOfMonth,
    );

    const isCurrentMonthGreaterThanBeforeMonth =
      currentMonthCreators.length >= beforeMonthCreators.length;

    const response: StatisticDTO = {
      totalAllCreations: allCreators.length,
      totalCreationCurrentMonth: currentMonthCreators.length,
      totalCreationBeforeMonth: beforeMonthCreators.length,
      totalCreationPublished: publishedCreators.length,
      totalCreationNeedApproval: needApprovalCreators.length,
      isCurrentMonthGreaterThanBeforeMonth:
        isCurrentMonthGreaterThanBeforeMonth,
      totalCurrentMonthPersentage: calculateStatisticPercentage(
        isCurrentMonthGreaterThanBeforeMonth,
        currentMonthCreators.length,
        beforeMonthCreators.length,
      ),
    };

    return response;
  }

  //Get Creator By uuid
  async getCreatorByUuid(uuid: string): Promise<Creator> {
    const result = await this.prisma.creator.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        talkCategory: true,
        series: {
          include: {
            seriesPodcast: true,
          },
        },
      },
    });
    this.handlingErrorNotFound(result, uuid, 'Creator');
    return result;
  }

  //Create Creator
  async createCreator(dto: CreatorDTO): Promise<Creator> {
    try {
      const findData = await this.prisma.talkCategory.findFirst({
        where: {
          id: dto.talkCategoryId,
        },
      });
      this.handlingErrorNotFound(findData, dto.talkCategoryId, 'Talk Category');
    } catch (error) {
      unlinkSync(`./uploads/${dto.path}`);
      throw error;
    }
    return await this.prisma.creator.create({
      data: {
        name: dto.name,
        description: dto.description,
        talkCategoryId: dto.talkCategoryId,
        personalNumber: dto.personalNumber,
        image: dto.image,
        path: dto.path,
        createdBy: dto.createdBy,
        unit: dto.unit,
        approvalStatus: 'Waiting Approval',
        approvalMessage: '',
        approvalBy: '',
        status: true,
        likeCount: 0,
        editorChoice: false,
      },
      include: {
        talkCategory: true,
        series: true,
      },
    });
  }

  //Update Creator
  async updateCreator(uuid: string, dto: CreatorDTO): Promise<Creator> {
    try {
      const findData = await this.prisma.creator.findFirst({
        where: {
          uuid: uuid,
        },
      });
      this.handlingErrorNotFound(findData, uuid, 'Creator');

      const findTalkCategoryData = await this.prisma.talkCategory.findFirst({
        where: {
          id: dto.talkCategoryId,
        },
      });
      this.handlingErrorNotFound(
        findTalkCategoryData,
        dto.talkCategoryId,
        'Talk Category',
      );

      unlinkSync(`./uploads/${findData.path}`);
    } catch (error) {
      unlinkSync(`./uploads/${dto.path}`);
      throw error;
    }
    return await this.prisma.creator.update({
      where: {
        uuid: uuid,
      },
      data: {
        name: dto.name,
        description: dto.description,
        talkCategoryId: dto.talkCategoryId,
        personalNumber: dto.personalNumber,
        createdBy: dto.createdBy,
        unit: dto.unit,
        image: dto.image,
        path: dto.path,
      },
    });
  }

  //Delete Creator
  async deleteCreator(uuid: string): Promise<Creator> {
    const findData = await this.prisma.creator.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Creator');
    unlinkSync(`./uploads/${findData.path}`);

    return await this.prisma.creator.delete({
      where: {
        uuid: uuid,
      },
    });
  }

  //Update Status Creator
  async updateCreatorStatus(
    uuid: string,
    dto: CreatorStatusDTO,
  ): Promise<Creator> {
    const findData = await this.prisma.creator.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Creator');
    return await this.prisma.creator.update({
      where: {
        uuid: uuid,
      },
      data: {
        status: dto.status,
      },
    });
  }

  //Update Creator Status Approval
  async updateCreatorStatusApproval(
    uuid: string,
    dto: CreatorStatusApprovalDTO,
  ): Promise<Creator> {
    const findData = await this.prisma.creator.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Creator');
    return await this.prisma.creator.update({
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

  //Update Editor Choice Creator
  async updateCreatorEditorChoice(
    uuid: string,
    dto: CreatorEditorChoiceDTO,
  ): Promise<Creator> {
    const findData = await this.prisma.creator.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Creator');
    return await this.prisma.creator.update({
      where: {
        uuid: uuid,
      },
      data: {
        editorChoice: dto.editorChoice,
      },
    });
  }

  private async getAllCreators(): Promise<Creator[]> {
    return this.prisma.creator.findMany();
  }

  private async getCreatorsByApprovalStatus(
    approvalStatus: string,
  ): Promise<Creator[]> {
    return this.prisma.creator.findMany({
      where: {
        approvalStatus,
      },
    });
  }

  private async getCreatorsByCreatedAtRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Creator[]> {
    return this.prisma.creator.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  }
}
