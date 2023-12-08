import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { BestParcticeServiceInterface } from '../interfaces/best-practice.service.interface';
import {
    BestPractice,
    CommentBestPractice,
    CommentLikeBestPractice,
} from '@prisma/clients/nex-learning';
import {
    BestPracticeDTO,
    BestPracticeApproveDTO,
    BestPracticeUpdateDTO,
    CommentLikeBestPracticeDTO,
    StatisticBestPracticeDTO,
} from '../dtos/best-practice.dto';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { unlinkSync } from 'fs';
import { ArticleStatusDTO } from '../../articles/dtos/article-status.dto';
import { CommentBestPracticeDTO } from '../dtos/comment-best-practice.dto';
import { ForYourPageService } from 'src/modules/homepage/for-your-page/services/for-your-page.service';
import { ForYourPageDTO } from 'src/modules/homepage/for-your-page/dto/for-your-page.dto';

@Injectable()
export class BestPracticeService
    extends AppError
    implements BestParcticeServiceInterface
{
    constructor(
        private readonly prisma: PrismaLearningService,
        private readonly fypService: ForYourPageService,
    ) {
        super(BestPracticeService.name);
    }

    async getStatisticBestPractice(): Promise<StatisticBestPracticeDTO> {
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

        const allTime = await this.prisma.bestPractice.count();
        const thisMonth = await this.prisma.bestPractice.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });
        const lastMonth = await this.prisma.bestPractice.count({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        });
        const published = await this.prisma.bestPractice.count({
            where: {
                approvalStatus: true,
            },
        });
        const needApproval = await this.prisma.bestPractice.count({
            where: {
                approvalStatus: null,
            },
        });

        const data: StatisticBestPracticeDTO = {
            allTime: allTime,
            thisMonth: thisMonth,
            published: published,
            needApproval: needApproval,
            percent: ((thisMonth - lastMonth) / thisMonth) * 100,
        };
        return data;
    }

    //Get Many Data Best Practice
    async getBestPractice(
        page: number,
        limit: number,
        search?: string,
        sortBy?: string,
    ): Promise<ResponseDTO<BestPractice[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const by_order = {};

        if (sortBy == 'desc' || sortBy == 'asc') {
            by_order['createdAt'] = sortBy;
        }
        if (sortBy == 'trending') {
            by_order['bestPracticeComment'] = {
                _count: 'desc',
            };
        }

        const result = await this.prisma.bestPractice.findMany({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { unit: { contains: search, mode: 'insensitive' } },
                    { uploadBy: { contains: search, mode: 'insensitive' } },
                    { approvalDesc: { contains: search, mode: 'insensitive' } },
                    { approvalBy: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            { unit: { contains: search, mode: 'insensitive' } },
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
            take: take,
            skip: skip,
            orderBy: by_order,
            include: {
                _count: {
                    select: {
                        bestPracticeComment: true,
                    },
                },
            },
        });
        this.handlingErrorEmptyData(result, 'Story');
        const total = await this.prisma.bestPractice.count({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { unit: { contains: search, mode: 'insensitive' } },
                    { uploadBy: { contains: search, mode: 'insensitive' } },
                    { approvalDesc: { contains: search, mode: 'insensitive' } },
                    { approvalBy: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            { unit: { contains: search, mode: 'insensitive' } },
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
        });
        const data: ResponseDTO<BestPractice[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Get data best practice by Id
    async getBestPracticeById(uuid: string): Promise<BestPractice> {
        const findData = await this.prisma.bestPractice.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                _count: {
                    select: {
                        bestPracticeComment: true,
                    },
                },
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Best Practice');
        return findData;
    }

    //Create Best Practice
    async createBestPractice(dto: BestPracticeDTO): Promise<BestPractice> {
        return await this.prisma.bestPractice.create({
            data: {
                personalNumber: dto.personalNumber,
                title: dto.title,
                content: dto.content,
                image: dto.image,
                path: dto.path,
                uploadBy: dto.uploadBy,
                unit: dto.unit,
                score: 25,
                approvalStatus: null,
                bannedStatus: false,
                editorChoice: false,
                favorite: false,
            },
        });
    }

    //Update Best Practice
    async updateBestPractice(
        uuid: string,
        dto: BestPracticeUpdateDTO,
    ): Promise<BestPractice> {
        const finddata = await this.prisma.bestPractice.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(finddata, uuid, 'Best Practice');
        unlinkSync(`./uploads/${finddata.path}`);
        await this.fypService.deleteForYourPage(finddata.uuid);
        return await this.prisma.bestPractice.update({
            where: {
                uuid: uuid,
            },
            data: {
                title: dto.title,
                content: dto.content,
                image: dto.image,
                path: dto.path,
                approvalStatus: null,
            },
        });
    }

    //Delete Best Practice
    async deleteBestPractice(uuid: string): Promise<BestPractice> {
        const finddata = await this.prisma.bestPractice.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(finddata, uuid, 'Best Practice');
        unlinkSync(`./uploads/${finddata.path}`);
        await this.fypService.deleteForYourPage(finddata.uuid);
        return await this.prisma.bestPractice.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    //Approve or Reject
    async approveReject(
        uuid: string,
        dto: BestPracticeApproveDTO,
    ): Promise<BestPractice> {
        const findData = await this.prisma.bestPractice.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Best Practice');
        if (dto.approvalStatus == true) {
            const fyp: ForYourPageDTO = {
                uuid: findData.uuid,
                idContent: findData.id,
                title: findData.title,
                description: findData.content,
                personalNumber: findData.personalNumber,
                personalName: findData.uploadBy,
                path: findData.path,
                link: '/user/nex-learning/best-practice/',
                category: 'article',
                cover: null,
            };
            await this.fypService.createForYourPage(fyp);
        }
        if (dto.approvalStatus == false) {
            await this.fypService.deleteForYourPage(findData.uuid);
        }
        return await this.prisma.bestPractice.update({
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
    async editorChoice(
        uuid: string,
        dto: ArticleStatusDTO,
    ): Promise<BestPractice> {
        const findData = await this.prisma.bestPractice.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Best Practice');
        return await this.prisma.bestPractice.update({
            where: {
                uuid: uuid,
            },
            data: {
                editorChoice: dto.status,
            },
        });
    }

    //Active or Deactive
    async activeDeactive(
        uuid: string,
        dto: ArticleStatusDTO,
    ): Promise<BestPractice> {
        const findData = await this.prisma.bestPractice.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Best Practice');
        if (dto.status == false) {
            const fyp: ForYourPageDTO = {
                uuid: findData.uuid,
                idContent: findData.id,
                title: findData.title,
                description: findData.content,
                personalNumber: findData.personalNumber,
                personalName: findData.uploadBy,
                path: findData.path,
                link: '/user/nex-learning/best-practice/',
                category: 'article',
                cover: null,
            };
            await this.fypService.createForYourPage(fyp);
        }
        if (dto.status == true) {
            await this.fypService.deleteForYourPage(findData.uuid);
        }
        return await this.prisma.bestPractice.update({
            where: {
                uuid: uuid,
            },
            data: {
                bannedStatus: dto.status,
            },
        });
    }

    //Get Comment
    async getComment(
        practiceId: number,
        page: number,
        limit: number,
        sortBy: string,
    ): Promise<ResponseDTO<CommentBestPractice[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const by_order = [];

        if (sortBy === 'trending') {
            by_order.push({
                like: 'desc',
            });
            by_order.push({
                commentLikeBestPractice: {
                    _count: 'desc',
                },
            });
            by_order.push({
                createdAt: 'desc',
            });
        }

        if (sortBy === 'desc') {
            by_order.push({
                createdAt: 'desc',
            });
        }

        const result = await this.prisma.commentBestPractice.findMany({
            where: {
                practiceId: Number(practiceId),
                parentId: null,
            },
            take: take,
            skip: skip,
            orderBy: by_order,
            include: {
                commentLikeBestPractice: true,
                _count: {
                    select: {
                        commentLikeBestPractice: true,
                        childComment: true,
                    },
                },
            },
        });

        this.handlingErrorEmptyData(result, 'Comment Best Practice');
        const total = await this.prisma.commentBestPractice.count({
            where: {
                practiceId: Number(practiceId),
                parentId: null,
            },
        });
        const data: ResponseDTO<CommentBestPractice[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Get Reply
    async getReplyComment(
        parentId: number,
        page: number,
        limit: number,
    ): Promise<ResponseDTO<CommentBestPractice[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const result = await this.prisma.commentBestPractice.findMany({
            where: {
                parentId: Number(parentId),
            },
            take: take,
            skip: skip,
            orderBy: [
                {
                    like: 'desc',
                },
                {
                    createdAt: 'asc',
                },
            ],
            include: {
                commentLikeBestPractice: true,
                _count: {
                    select: {
                        commentLikeBestPractice: true,
                    },
                },
            },
        });

        this.handlingErrorEmptyData(result, 'Comment Best Practice');
        const total = await this.prisma.commentBestPractice.count({
            where: {
                parentId: Number(parentId),
            },
        });
        const data: ResponseDTO<CommentBestPractice[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Create Comment
    async createComment(
        dto: CommentBestPracticeDTO,
    ): Promise<CommentBestPractice> {
        return await this.prisma.commentBestPractice.create({
            data: {
                ...dto,
                like: 0,
                dislike: 0,
            },
        });
    }

    //Update Comment
    async updateComment(
        uuid: string,
        dto: CommentBestPracticeDTO,
    ): Promise<CommentBestPractice> {
        const findData = await this.prisma.commentBestPractice.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Comment Best Practice');
        return await this.prisma.commentBestPractice.update({
            where: {
                uuid: uuid,
            },
            data: {
                comment: dto.comment,
            },
        });
    }

    //Delete Comment
    async deleteComment(uuid: string): Promise<CommentBestPractice> {
        const findData = await this.prisma.commentBestPractice.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Comment Best Practice');
        return await this.prisma.commentBestPractice.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    async likeDislikeComment(
        bestPracticeId: number,
        commentBestPracticeId: number,
        personalNumber: string,
        dto: CommentLikeBestPracticeDTO,
    ): Promise<CommentLikeBestPractice> {
        const findData = await this.prisma.commentLikeBestPractice.findFirst({
            where: {
                bestPracticeId: Number(bestPracticeId),
                commentBestPracticeId: Number(commentBestPracticeId),
                personalNumber: personalNumber,
            },
        });

        if (findData) {
            const total = await this.prisma.commentBestPractice.findFirst({
                where: {
                    id: Number(commentBestPracticeId),
                },
            });
            if (findData.likeOrdislike == dto.likeOrdislike) {
                if (findData.likeOrdislike == true) {
                    await this.prisma.commentBestPractice.update({
                        where: {
                            id: Number(commentBestPracticeId),
                        },
                        data: {
                            like: total.like - 1,
                            // dislike: total.dislike - 1
                        },
                    });
                    return await this.prisma.commentLikeBestPractice.delete({
                        where: {
                            id: findData.id,
                        },
                    });
                }
                if (findData.likeOrdislike == false) {
                    await this.prisma.commentBestPractice.update({
                        where: {
                            id: Number(commentBestPracticeId),
                        },
                        data: {
                            // like: total.like - 1,
                            dislike: total.dislike - 1,
                        },
                    });
                    return await this.prisma.commentLikeBestPractice.delete({
                        where: {
                            id: findData.id,
                        },
                    });
                }
            }
            if (findData.likeOrdislike != dto.likeOrdislike) {
                if (dto.likeOrdislike == true) {
                    await this.prisma.commentBestPractice.update({
                        where: {
                            id: Number(commentBestPracticeId),
                        },
                        data: {
                            like: total.like + 1,
                            dislike: total.dislike - 1,
                        },
                    });
                    return await this.prisma.commentLikeBestPractice.update({
                        where: {
                            id: findData.id,
                        },
                        data: {
                            ...dto,
                        },
                    });
                }
                if (dto.likeOrdislike == false) {
                    await this.prisma.commentBestPractice.update({
                        where: {
                            id: Number(commentBestPracticeId),
                        },
                        data: {
                            like: total.like - 1,
                            dislike: total.dislike + 1,
                        },
                    });
                    return await this.prisma.commentLikeBestPractice.update({
                        where: {
                            id: findData.id,
                        },
                        data: {
                            ...dto,
                        },
                    });
                }
            }
        }

        if (!findData) {
            const total = await this.prisma.commentBestPractice.findFirst({
                where: {
                    id: Number(commentBestPracticeId),
                },
            });
            if (dto.likeOrdislike == true) {
                await this.prisma.commentBestPractice.update({
                    where: {
                        id: Number(commentBestPracticeId),
                    },
                    data: {
                        like: total.like + 1,
                        // dislike: total.dislike - 1
                    },
                });
                return await this.prisma.commentLikeBestPractice.create({
                    data: {
                        ...dto,
                    },
                });
            }
            if (dto.likeOrdislike == false) {
                await this.prisma.commentBestPractice.update({
                    where: {
                        id: Number(commentBestPracticeId),
                    },
                    data: {
                        // like: total.like - 1,
                        dislike: total.dislike + 1,
                    },
                });
                return await this.prisma.commentLikeBestPractice.create({
                    data: {
                        ...dto,
                    },
                });
            }
        }
    }
}
