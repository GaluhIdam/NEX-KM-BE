import { StoryWatch } from '@prisma/clients/nex-learning';
import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { StoryServiceInterface } from '../interfaces/story.service.interface';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { Story } from '@prisma/clients/nex-learning';
import { StatisticStoryDTO, StoryDTO } from '../dtos/story.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { StoryStatusDTO, StoryStatusOnlyDTO } from '../dtos/story-status.dto';
import * as fs from 'fs/promises';
import { StoryWatchDTO } from '../dtos/story-watch.dto';
import { unlinkSync } from 'fs';
import { LearningFuseService } from '../../fuse/learning.fuse.service';
import { ForYourPageService } from 'src/modules/homepage/for-your-page/services/for-your-page.service';
import { ForYourPageDTO } from 'src/modules/homepage/for-your-page/dto/for-your-page.dto';

@Injectable()
export class StoryService extends AppError implements StoryServiceInterface {
    constructor(
        @InjectQueue('video-upload') private readonly videouploadQueue: Queue,
        private readonly prisma: PrismaLearningService,
        private readonly learningFuseService: LearningFuseService,
        private readonly fypService: ForYourPageService,
    ) {
        super(StoryService.name);
    }

    async getStatisticStory(category: string): Promise<StatisticStoryDTO> {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
        );

        const startOfLastMonth = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            1,
        );
        const endOfLastMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0,
        );

        const allTime = await this.prisma.story.count({
            where: {
                category: category,
            },
        });
        const thisMonth = await this.prisma.story.count({
            where: {
                category: category,
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });
        const lastMonth = await this.prisma.story.count({
            where: {
                category: category,
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        });
        const published = await this.prisma.story.count({
            where: {
                category: category,
                approvalStatus: true,
            },
        });
        const needApproval = await this.prisma.story.count({
            where: {
                category: category,
                approvalStatus: null,
            },
        });

        const data: StatisticStoryDTO = {
            allTime: allTime,
            thisMonth: thisMonth,
            published: published,
            needApproval: needApproval,
            percent: ((thisMonth - lastMonth) / thisMonth) * 100,
        };
        return data;
    }

    //Get Story
    async getStory(
        page: number,
        limit: number,
        search: string,
        category: string,
        sortBy: string,
        isAdmin?: string,
    ): Promise<ResponseDTO<Story[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const by_order = [];

        if (sortBy == 'desc' || sortBy == 'asc') {
            by_order['createdAt'] = sortBy;
        }
        if (sortBy == 'trending') {
            by_order['watchStory'] = {
                _count: 'desc',
            };
        }
        //By Title
        if (sortBy === 'titleASC') {
            by_order.push({
                title: 'asc',
            });
        }
        if (sortBy === 'titleDESC') {
            by_order.push({
                title: 'desc',
            });
        }

        //By created by
        if (sortBy === 'createdByASC') {
            by_order.push({
                uploadBy: 'asc',
            });
        }
        if (sortBy === 'createdByDESC') {
            by_order.push({
                uploadBy: 'desc',
            });
        }

        //By Unit
        if (sortBy === 'unitASC') {
            by_order.push({
                unit: 'asc',
            });
        }
        if (sortBy === 'unitDESC') {
            by_order.push({
                unit: 'desc',
            });
        }

        //By Score
        if (sortBy === 'scoreASC') {
            by_order.push({
                score: 'asc',
            });
        }
        if (sortBy === 'scoreDESC') {
            by_order.push({
                score: 'desc',
            });
        }

        //By Created At
        if (sortBy === 'createdAtASC') {
            by_order.push({
                createdAt: 'asc',
            });
        }
        if (sortBy === 'createdAtDESC') {
            by_order.push({
                createdAt: 'desc',
            });
        }

        //By Approval Status
        if (sortBy === 'approvalStatusASC') {
            by_order.push({
                approvalStatus: 'asc',
            });
        }
        if (sortBy === 'approvalStatusDESC') {
            by_order.push({
                approvalStatus: 'desc',
            });
        }

        //By Approval Status Desc
        if (sortBy === 'approvalDescASC') {
            by_order.push({
                approvalDesc: 'asc',
            });
        }
        if (sortBy === 'approvalDescDESC') {
            by_order.push({
                approvalDesc: 'desc',
            });
        }

        //By Approval by
        if (sortBy === 'approvalByASC') {
            by_order.push({
                approvalBy: 'asc',
            });
        }
        if (sortBy === 'approvalByDESC') {
            by_order.push({
                approvalBy: 'desc',
            });
        }

        //By Editor Choice
        if (sortBy === 'editorChoiceASC') {
            by_order.push({
                editorChoice: 'asc',
            });
        }
        if (sortBy === 'editorChoiceDESC') {
            by_order.push({
                editorChoice: 'desc',
            });
        }

        //By Banned
        if (sortBy === 'bannedStatusASC') {
            by_order.push({
                bannedStatus: 'asc',
            });
        }
        if (sortBy === 'bannedStatusDESC') {
            by_order.push({
                bannedStatus: 'desc',
            });
        }

        if (isAdmin == 'true') {
            const result = await this.prisma.story.findMany({
                where: {
                    AND: [
                        { category: category },
                        {
                            OR: [
                                {
                                    title: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    unit: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    uploadBy: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalDesc: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalBy: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    AND: [
                                        {
                                            title: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            unit: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            uploadBy: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            approvalDesc: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            approvalBy: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                take: take,
                skip: skip,
                orderBy: by_order,
                include: {
                    _count: {
                        select: {
                            watchStory: true,
                        },
                    },
                    watchStory: true,
                },
            });
            this.handlingErrorEmptyData(result, 'Story');
            const total = await this.prisma.story.count({
                where: {
                    AND: [
                        { category: category },
                        {
                            OR: [
                                {
                                    title: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    unit: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    uploadBy: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalDesc: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalBy: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    AND: [
                                        {
                                            title: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            unit: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            uploadBy: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            approvalDesc: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            approvalBy: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            });
            const data: ResponseDTO<Story[]> = {
                result: result,
                total: total,
            };
            return data;
        } else {
            const result = await this.prisma.story.findMany({
                where: {
                    AND: [
                        { category: category },
                        { approvalStatus: true },
                        { bannedStatus: false },
                        {
                            OR: [
                                {
                                    title: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    unit: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    uploadBy: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalDesc: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalBy: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    AND: [
                                        {
                                            title: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            unit: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            uploadBy: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            approvalDesc: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            approvalBy: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                take: take,
                skip: skip,
                orderBy: by_order,
                include: {
                    _count: {
                        select: {
                            watchStory: true,
                        },
                    },
                    watchStory: true,
                },
            });
            this.handlingErrorEmptyData(result, 'Story');
            const total = await this.prisma.story.count({
                where: {
                    AND: [
                        { category: category },
                        { approvalStatus: true },
                        { bannedStatus: false },
                        {
                            OR: [
                                {
                                    title: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    unit: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    uploadBy: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalDesc: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalBy: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    AND: [
                                        {
                                            title: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            unit: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            uploadBy: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            approvalDesc: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            approvalBy: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            });
            const data: ResponseDTO<Story[]> = {
                result: result,
                total: total,
            };
            return data;
        }
    }

    //Get By Id
    async getStoryById(uuid: string): Promise<Story> {
        const findData = await this.prisma.story.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                _count: {
                    select: {
                        watchStory: true,
                    },
                },
                watchStory: true,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Story');
        return findData;
    }

    //Create Story
    async createStory(dto: StoryDTO): Promise<Story> {
        await this.learningFuseService.createCheck(dto.title);
        return await this.prisma.story.create({
            data: {
                uploadBy: dto.uploadBy,
                category: dto.category,
                title: dto.title,
                description: dto.description,
                personalNumber: dto.personalNumber,
                unit: dto.unit,
                video: dto.video,
                path: dto.path,
                score: 25,
                editorChoice: false,
                favorite: false,
                bannedStatus: false,
                view: 0,
                cover: dto.cover,
            },
        });
    }

    //Update Story
    async updateStory(uuid: string, dto: StoryDTO): Promise<Story> {
        const findData = await this.prisma.story.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Story');
        unlinkSync(`./uploads/${findData.cover}`);
        unlinkSync(`./uploads/${findData.path}`);
        await this.fypService.deleteForYourPage(findData.uuid);
        return await this.prisma.story.update({
            where: {
                uuid: uuid,
            },
            data: {
                title: dto.title,
                category: dto.category,
                video: dto.video,
                path: dto.path,
                description: dto.description,
                cover: dto.cover,
                approvalStatus: null,
            },
        });
    }

    //Delete Story
    async deleteStory(uuid: string): Promise<Story> {
        const findData = await this.prisma.story.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Story');
        await fs.rm(
            `./uploads/story/${findData.video
                .split('.')
                .slice(0, -1)
                .join('.')}`,
            {
                recursive: true,
                force: true,
            },
        );
        await this.fypService.deleteForYourPage(findData.uuid);
        return await this.prisma.story.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    //Approval or Rejecetion
    async approveReject(uuid: string, dto: StoryStatusDTO): Promise<Story> {
        const findData = await this.prisma.story.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Story');
        if (dto.approvalStatus == true) {
            const fyp: ForYourPageDTO = {
                idContent: findData.id,
                uuid: findData.uuid,
                title: findData.title,
                description: findData.description,
                personalNumber: findData.personalNumber,
                personalName: findData.uploadBy,
                path: findData.path,
                link: '/user/nex-learning/story-view/',
                category: 'story',
                cover: findData.cover,
            };
            await this.fypService.createForYourPage(fyp);
        }
        if (dto.approvalStatus == false) {
            await this.fypService.deleteForYourPage(findData.uuid);
        }
        return await this.prisma.story.update({
            where: {
                uuid: uuid,
            },
            data: {
                approvalStatus: dto.approvalStatus,
                approvalBy: dto.approvalBy,
                approvalDesc: dto.approvalDesc,
            },
        });
    }

    //Editor Choice
    async editorChoice(uuid: string, dto: StoryStatusOnlyDTO): Promise<Story> {
        const findData = await this.prisma.story.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Story');
        return await this.prisma.story.update({
            where: {
                uuid: uuid,
            },
            data: {
                editorChoice: dto.status,
            },
        });
    }

    //Banned Action
    async activeDeactive(
        uuid: string,
        dto: StoryStatusOnlyDTO,
    ): Promise<Story> {
        const findData = await this.prisma.story.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Story');
        if (dto.status == false) {
            const fyp: ForYourPageDTO = {
                idContent: findData.id,
                uuid: findData.uuid,
                title: findData.title,
                description: findData.description,
                personalNumber: findData.personalNumber,
                personalName: findData.uploadBy,
                path: findData.path,
                link: '/user/nex-learning/story-view/',
                category: 'story',
                cover: findData.cover,
            };
            await this.fypService.createForYourPage(fyp);
        }
        if (dto.status == true) {
            await this.fypService.deleteForYourPage(findData.uuid);
        }
        return await this.prisma.story.update({
            where: {
                uuid: uuid,
            },
            data: {
                bannedStatus: dto.status,
            },
        });
    }

    //Watch Story
    async watchStory(
        uuid: string,
        personalNumber: string,
        storyId: number,
        dto: StoryWatchDTO,
    ): Promise<Story> {
        const findData = await this.prisma.storyWatch.findFirst({
            where: {
                personalNumber: personalNumber,
                storyId: Number(storyId),
            },
        });
        if (!findData) {
            const count = await this.prisma.story.findFirst({
                where: {
                    uuid: uuid,
                },
            });
            await this.prisma.storyWatch.create({
                data: {
                    personalNumber: dto.personalNumber,
                    storyId: Number(dto.storyId),
                },
            });
            return await this.prisma.story.update({
                where: {
                    uuid: uuid,
                },
                data: {
                    view: count.view + 1,
                },
            });
        } else {
            return await this.prisma.story.findFirst({
                where: {
                    id: Number(storyId),
                },
            });
        }
    }
}
