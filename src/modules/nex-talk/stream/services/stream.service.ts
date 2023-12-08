import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { StreamServiceInterface } from '../interfaces/stream.service.interface';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { FavoriteStream, Stream, WatchStream } from '@prisma/clients/nex-talk';
import { StreamDTO } from '../dtos/stream.dto';
import { rm, unlinkSync } from 'fs';
import { FavoriteDTO } from '../dtos/favorite.dto';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';
import { StreamStatusDTO } from '../dtos/stream-status.dto';
import { StreamStatusApprovalDTO } from '../dtos/stream-status.approval.dto';
import { StreamEditorChoiceDTO } from '../dtos/stream-editor-choice.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';
import calculateStatisticPercentage from 'src/core/utility/statistic-percentage-util';
import { StreamsearchService } from './stream-search.service';

@Injectable()
export class StreamService extends AppError implements StreamServiceInterface {
  constructor(
    private readonly prisma: PrismaTalkService,
    private readonly streamSearchService: StreamsearchService,
  ) {
    super(StreamService.name);
  }

  //Get Stream
  async getStream(
    page: number,
    limit: number,
    orderBy?: string,
    search?: string,
    editorChoice?: boolean,
    personalNumber?: string,
    status?: boolean,
    approvalStatus?: string,
  ): Promise<PaginationDTO<Stream[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const by_order = {};
    if (orderBy == 'trending') {
      by_order['streamWatch'] = {
        _count: 'desc',
      };
    }
    if (orderBy == 'favorite') {
      by_order['streamFavorite'] = {
        _count: 'desc',
      };
    }

    let where = {};

    const filters = [];

    if (status !== null) {
      filters.push({ status: status });
    }

    if (editorChoice !== null) {
      filters.push({ editorChoice: editorChoice });
    }

    if (personalNumber) {
      filters.push({ personalNumber: personalNumber });
    }

    if (approvalStatus) {
      filters.push({ approvalStatus: approvalStatus });
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

    const result = await this.prisma.stream.findMany({
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
        streamWatch: true,
        streamFavorite: true,
      },
    });

    const totalItems = await this.prisma.stream.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<Stream[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Stream');
    return response;
  }

  //Get Stream Statistic
  async getStreamStatistic(): Promise<StatisticDTO> {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const firstDayOfBeforeMonth = new Date(currentYear, currentMonth - 2, 1);
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const firstDayOfNextMonth = new Date(currentYear, currentMonth, 1);

    const allStreams = await this.getAllStreams();
    const needApprovalStreams = await this.getStreamsByApprovalStatus(
      'Waiting Approval',
    );
    const publishedStreams = await this.getStreamsByApprovalStatus('Approved');
    const currentMonthStreams = await this.getStreamsByCreatedAtRange(
      firstDayOfMonth,
      firstDayOfNextMonth,
    );
    const beforeMonthStreams = await this.getStreamsByCreatedAtRange(
      firstDayOfBeforeMonth,
      firstDayOfMonth,
    );

    const isCurrentMonthGreaterThanBeforeMonth =
      currentMonthStreams.length >= beforeMonthStreams.length;

    const response: StatisticDTO = {
      totalAllCreations: allStreams.length,
      totalCreationCurrentMonth: currentMonthStreams.length,
      totalCreationBeforeMonth: beforeMonthStreams.length,
      totalCreationPublished: publishedStreams.length,
      totalCreationNeedApproval: needApprovalStreams.length,
      isCurrentMonthGreaterThanBeforeMonth:
        isCurrentMonthGreaterThanBeforeMonth,
      totalCurrentMonthPersentage: calculateStatisticPercentage(
        isCurrentMonthGreaterThanBeforeMonth,
        currentMonthStreams.length,
        beforeMonthStreams.length,
      ),
    };

    return response;
  }

  //Get Stream By uuid
  async getStreamByUuid(uuid: string): Promise<Stream> {
    const result = await this.prisma.stream.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        talkCategory: true,
        streamWatch: true,
        streamFavorite: true,
      },
    });
    this.handlingErrorNotFound(result, uuid, 'Stream');
    return result;
  }

  //Create Stream
  async createStream(dto: StreamDTO): Promise<Stream> {
    const findData = await this.prisma.talkCategory.findFirst({
      where: {
        id: dto.talkCategoryId,
      },
    });
    this.handlingErrorNotFound(findData, dto.talkCategoryId, 'Talk Category');

    const stream: Stream = await this.prisma.stream.create({
      data: {
        title: dto.title,
        description: dto.description,
        personalNumber: dto.personalNumber,
        thumbnail: dto.thumbnail,
        pathThumbnail: dto.pathThumbnail,
        video: dto.video,
        pathVideo: dto.pathVideo,
        talkCategoryId: dto.talkCategoryId,
        createdBy: dto.createdBy,
        unit: dto.unit,
        approvalStatus: 'Waiting Approval',
        approvalMessage: '',
        approvalBy: '',
        status: true,
        likeCount: 0,
        viewCount: 0,
        editorChoice: false,
      },
    });

    this.streamSearchService.indexStream(stream);
    return stream;
  }

  //Update Stream
  async updateStream(uuid: string, dto: StreamDTO): Promise<Stream> {
    const findData = await this.prisma.stream.findFirst({
      where: {
        uuid: uuid,
      },
    });
    if (!findData) {
      unlinkSync(`.uploads/${dto.pathVideo}`);
      unlinkSync(`.uploads/${dto.pathThumbnail}`);
    }
    this.handlingErrorNotFound(findData, uuid, 'Stream');

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

    rm(
      `./uploads/stream/file/${findData.video}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
      },
    );
    unlinkSync(`./uploads/stream/thumbnail/${findData.thumbnail}`);
    const stream: Stream = await this.prisma.stream.update({
      where: {
        uuid: uuid,
      },
      data: {
        title: dto.title,
        description: dto.description,
        personalNumber: dto.personalNumber,
        thumbnail: dto.thumbnail,
        pathThumbnail: dto.pathThumbnail,
        video: dto.video,
        pathVideo: dto.pathVideo,
        talkCategoryId: dto.talkCategoryId,
        createdBy: dto.createdBy,
        unit: dto.unit,
      },
    });

    await this.streamSearchService.update(stream);
    return stream;
  }

  //Delete Stream
  async deleteStream(uuid: string): Promise<Stream> {
    const findData = await this.prisma.stream.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Stream');
    unlinkSync(`./uploads/stream/thumbnail/${findData.thumbnail}`);
    rm(
      `./uploads/stream/file/${findData.video}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
      },
    );
    const deleted: Stream = await this.prisma.stream.delete({
      where: {
        uuid: uuid,
      },
    });

    await this.streamSearchService.remove(uuid);
    return deleted;
  }

  //Add Favorite
  async addFavorite(dto: FavoriteDTO): Promise<FavoriteStream> {
    const findData = await this.prisma.stream.findFirst({
      where: {
        id: dto.streamId,
      },
    });
    this.handlingErrorNotFound(findData, dto.streamId, 'Stream');
    return await this.prisma.favoriteStream.create({
      data: {
        streamId: dto.streamId,
        personalNumber: dto.personalNumber,
      },
    });
  }

  //Delete Favorite
  async deleteFavorite(personalNumber: string): Promise<FavoriteStream> {
    const findData = await this.prisma.favoriteStream.findFirst({
      where: {
        personalNumber: personalNumber,
      },
    });
    this.handlingErrorNotFound(findData, personalNumber, 'Favorite');
    return await this.prisma.favoriteStream.delete({
      where: {
        uuid: findData.uuid,
      },
    });
  }

  //Update Status Stream
  async updateStreamStatus(
    uuid: string,
    dto: StreamStatusDTO,
  ): Promise<Stream> {
    const findData = await this.prisma.stream.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Stream');
    const stream: Stream = await this.prisma.stream.update({
      where: {
        uuid: uuid,
      },
      data: {
        status: dto.status,
      },
    });

    await this.streamSearchService.update(stream);
    return stream;
  }

  //Update Stream Status Approval
  async updateStreamStatusApproval(
    uuid: string,
    dto: StreamStatusApprovalDTO,
  ): Promise<Stream> {
    const findData = await this.prisma.stream.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Stream');
    const stream: Stream = await this.prisma.stream.update({
      where: {
        uuid: uuid,
      },
      data: {
        approvalStatus: dto.approvalStatus,
        approvalMessage: dto.approvalMessage ?? '',
        approvalBy: dto.approvalBy,
      },
    });

    await this.streamSearchService.update(stream);
    return stream;
  }

  //Update Editor Choice Stream
  async updateStreamEditorChoice(
    uuid: string,
    dto: StreamEditorChoiceDTO,
  ): Promise<Stream> {
    const findData = await this.prisma.stream.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Stream');
    const stream: Stream = await this.prisma.stream.update({
      where: {
        uuid: uuid,
      },
      data: {
        editorChoice: dto.editorChoice,
      },
    });

    await this.streamSearchService.update(stream);
    return stream;
  }

  private async getAllStreams(): Promise<Stream[]> {
    return this.prisma.stream.findMany();
  }

  private async getStreamsByApprovalStatus(
    approvalStatus: string,
  ): Promise<Stream[]> {
    return this.prisma.stream.findMany({
      where: {
        approvalStatus,
      },
    });
  }

  private async getStreamsByCreatedAtRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Stream[]> {
    return this.prisma.stream.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  }

  //Add Watch
  async addWatchStream(dto: FavoriteDTO): Promise<WatchStream> {
    const findData = await this.prisma.stream.findFirst({
      where: {
        id: dto.streamId,
      },
    });
    this.handlingErrorNotFound(findData, dto.streamId, 'Stream');
    return await this.prisma.watchStream.create({
      data: {
        streamId: dto.streamId,
        personalNumber: dto.personalNumber,
      },
    });
  }

  async search(query: string): Promise<Record<string, any>> {
    return await this.streamSearchService.search(query);
  }
}
