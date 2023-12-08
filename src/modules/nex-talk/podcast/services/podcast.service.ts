import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PodcastServiceInterface } from '../interfaces/podcast.service.interface';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { Podcast } from '@prisma/clients/nex-talk';
import { PodcastDTO } from '../dtos/podcast.dto';
import { rm, unlinkSync } from 'fs';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
import { PodcastStatusApprovalDTO } from '../dtos/podcast-status-approval.dto';
import { PodcastEditorChoiceDTO } from '../dtos/podcast-editor-choice.dto';
import { PodcastStatusDTO } from '../dtos/podcast-status.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';
import calculateStatisticPercentage from 'src/core/utility/statistic-percentage-util';
import { PodcastsearchService } from './podcast-search.service';

@Injectable()
export class PodcastService
    extends AppError
    implements PodcastServiceInterface
{
    constructor(
        private readonly prisma: PrismaTalkService,
        private readonly podcastSearchService: PodcastsearchService,
    ) {
        super(PodcastService.name);
    }

    //Get Podcast
    async getPodcast(
        page: number,
        limit: number,
        search?: string,
        orderBy?: string,
        personalNumber?: string,
        serieId?: number,
        status?: boolean,
        approvalStatus?: string,
    ): Promise<PaginationDTO<Podcast[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const by_order = {};
        if (orderBy == 'desc' || orderBy == 'asc') {
            by_order['createdAt'] = orderBy;
        } else if (orderBy == 'lastPlayed') {
            by_order['updatedAt'] = 'desc';
        } else if (orderBy == 'mostLiked') {
            by_order['likeCount'] = 'desc';
        }

        let where = {};

        const filters = [];

        if (personalNumber) {
            filters.push({ personalNumber: personalNumber });
        }

        if (serieId) {
            filters.push({ serieId: serieId });
        }

        if (status != null) {
            filters.push({ status: status });
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
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            });
        }

        if (filters.length > 0) {
            where = { AND: filters };
        }

        const result = await this.prisma.podcast.findMany({
            where: where,
            take: take,
            skip: skip,
            orderBy: by_order,
            include: {
                seriePodcast: {
                    select: {
                        uuid: true,
                        title: true,
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
                    },
                },
                colaboratorPodcast: true,
            },
        });

        const totalItems = await this.prisma.podcast.count({ where });
        const totalPages = Math.ceil(totalItems / take);

        const response: PaginationDTO<Podcast[]> = {
            page: Number(page),
            limit: take,
            totalItems: totalItems,
            totalPages: totalPages,
            data: result,
        };

        this.handlingErrorEmptyDataPagination(response, 'Podcast');
        return response;
    }

    //Get Podcast Statistic
    async getPodcastStatistic(): Promise<StatisticDTO> {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const firstDayOfBeforeMonth = new Date(
            currentYear,
            currentMonth - 2,
            1,
        );
        const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const firstDayOfNextMonth = new Date(currentYear, currentMonth, 1);

        const allPodcasts = await this.getAllPodcasts();
        const needApprovalPodcasts = await this.getPodcastsByApprovalStatus(
            'Waiting Approval',
        );
        const publishedPodcasts = await this.getPodcastsByApprovalStatus(
            'Approved',
        );
        const currentMonthPodcasts = await this.getPodcastsByCreatedAtRange(
            firstDayOfMonth,
            firstDayOfNextMonth,
        );
        const beforeMonthPodcasts = await this.getPodcastsByCreatedAtRange(
            firstDayOfBeforeMonth,
            firstDayOfMonth,
        );

        const isCurrentMonthGreaterThanBeforeMonth =
            currentMonthPodcasts.length >= beforeMonthPodcasts.length;

        const response: StatisticDTO = {
            totalAllCreations: allPodcasts.length,
            totalCreationCurrentMonth: currentMonthPodcasts.length,
            totalCreationBeforeMonth: beforeMonthPodcasts.length,
            totalCreationPublished: publishedPodcasts.length,
            totalCreationNeedApproval: needApprovalPodcasts.length,
            isCurrentMonthGreaterThanBeforeMonth:
                isCurrentMonthGreaterThanBeforeMonth,
            totalCurrentMonthPersentage: calculateStatisticPercentage(
                isCurrentMonthGreaterThanBeforeMonth,
                currentMonthPodcasts.length,
                beforeMonthPodcasts.length,
            ),
        };

        return response;
    }

    //Get Podcast with Id
    async getPodcastById(uuid: string): Promise<Podcast> {
        const result = await this.prisma.podcast.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                seriePodcast: {
                    include: {
                        creator: {
                            include: {
                                talkCategory: true,
                            },
                        },
                    },
                },
                colaboratorPodcast: true,
            },
        });
        this.handlingErrorNotFound(result, uuid, 'Podcast');
        return result;
    }

    //Create Podcast
    async createPodcast(dto: PodcastDTO): Promise<Podcast> {
        const findData = await this.prisma.serie.findFirst({
            where: {
                id: dto.seriesId,
            },
        });
        if (!findData) {
            unlinkSync(`./uploads/podcast/file/${dto.file}`);
            unlinkSync(`./uploads/podcast/cover/${dto.image}`);
        }

        this.handlingErrorNotFound(findData, dto.seriesId, 'Series');
        const podcast = await this.prisma.podcast.create({
            data: {
                serieId: dto.seriesId,
                title: dto.title,
                description: dto.description,
                image: dto.image,
                pathImage: dto.pathImage,
                file: dto.file,
                pathFile: dto.pathFile,
                approvalStatus: 'Waiting Approval',
                approvalMessage: '',
                approvalBy: '',
                status: true,
                likeCount: 0,
                editorChoice: false,
                personalNumber: dto.personalNumber,
                createdBy: dto.createdBy,
            },
        });

        this.podcastSearchService.indexPodcast(podcast);
        return podcast;
    }

    //Update Podcast
    async updatePodcast(uuid: string, dto: PodcastDTO): Promise<Podcast> {
        const findData = await this.prisma.podcast.findFirst({
            where: {
                uuid: uuid,
            },
        });
        if (!findData) {
            unlinkSync(`./uploads/podcast/file/${dto.file}`);
            unlinkSync(`./uploads/podcast/cover/${dto.image}`);
        }
        this.handlingErrorNotFound(findData, uuid, 'Podcast');

        const findSeries = await this.prisma.serie.findFirst({
            where: {
                id: dto.seriesId,
            },
        });
        if (!findSeries) {
            unlinkSync(`./uploads/podcast/file/${dto.file}`);
            unlinkSync(`./uploads/podcast/cover/${dto.image}`);
        }
        this.handlingErrorNotFound(findSeries, dto.seriesId, 'Series');
        rm(`./uploads/${findData.pathFile}`, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        });
        unlinkSync(`./uploads/${findData.pathImage}`);
        const podcast = await this.prisma.podcast.update({
            where: {
                uuid: uuid,
            },
            data: {
                serieId: dto.seriesId,
                title: dto.title,
                description: dto.description,
                image: dto.image,
                pathImage: dto.pathImage,
                file: dto.file,
                pathFile: dto.pathFile,
                personalNumber: dto.personalNumber,
                createdBy: dto.createdBy,
            },
        });

        await this.podcastSearchService.update(podcast);
        return podcast;
    }

    //Delete Podcast
    async deletePodcast(uuid: string): Promise<Podcast> {
        const findData = await this.prisma.podcast.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Podcast');
        unlinkSync(`./uploads/podcast/cover/${findData.image}`);
        rm(`./uploads/${findData.pathFile}`, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        });
        const deleted = await this.prisma.podcast.delete({
            where: {
                uuid: uuid,
            },
        });

        this.podcastSearchService.remove(uuid);
        return deleted;
    }

    //Update Status Podcast
    async updatePodcastStatus(
        uuid: string,
        dto: PodcastStatusDTO,
    ): Promise<Podcast> {
        const findData = await this.prisma.podcast.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Podcast');
        const podcast = await this.prisma.podcast.update({
            where: {
                uuid: uuid,
            },
            data: {
                status: dto.status,
            },
        });

        await this.podcastSearchService.update(podcast);
        return podcast;
    }

    //Update Podcast Status Approval
    async updatePodcastStatusApproval(
        uuid: string,
        dto: PodcastStatusApprovalDTO,
    ): Promise<Podcast> {
        const findData = await this.prisma.podcast.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Podcast');
        const podcast = await this.prisma.podcast.update({
            where: {
                uuid: uuid,
            },
            data: {
                approvalStatus: dto.approvalStatus,
                approvalMessage: dto.approvalMessage ?? '',
                approvalBy: dto.approvalBy,
            },
        });

        await this.podcastSearchService.update(podcast);
        return podcast;
    }

    //Update Editor Choice Podcast
    async updatePodcastEditorChoice(
        uuid: string,
        dto: PodcastEditorChoiceDTO,
    ): Promise<Podcast> {
        const findData = await this.prisma.podcast.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Podcast');
        const podcast = await this.prisma.podcast.update({
            where: {
                uuid: uuid,
            },
            data: {
                editorChoice: dto.editorChoice,
            },
        });

        await this.podcastSearchService.update(podcast);
        return podcast;
    }

    //Play Podcast by Update updatedAt
    async playPodcast(uuid: string): Promise<Podcast> {
        const findData = await this.prisma.podcast.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Podcast');
        return await this.prisma.podcast.update({
            where: {
                uuid: uuid,
            },
            data: {
                uuid: uuid,
            },
        });
    }

    private async getAllPodcasts(): Promise<Podcast[]> {
        return this.prisma.podcast.findMany();
    }

    private async getPodcastsByApprovalStatus(
        approvalStatus: string,
    ): Promise<Podcast[]> {
        return this.prisma.podcast.findMany({
            where: {
                approvalStatus,
            },
        });
    }

    private async getPodcastsByCreatedAtRange(
        startDate: Date,
        endDate: Date,
    ): Promise<Podcast[]> {
        return this.prisma.podcast.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
        });
    }

    async search(query: string): Promise<Record<string, any>> {
        return await this.podcastSearchService.search(query);
    }
}
