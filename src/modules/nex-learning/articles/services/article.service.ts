import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { ArticleServiceInterface } from '../interfaces/article.service.interface';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { Article } from '@prisma/clients/nex-learning';
import { ArticleDTO, StatisticArticleDTO } from '../dtos/article.dto';
import { unlinkSync } from 'fs';
import { ArticleStatusDTO } from '../dtos/article-status.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { ArticlesearchService } from './articlesearch.service';
import { LearningFuseService } from '../../fuse/learning.fuse.service';
import { ForYourPageService } from 'src/modules/homepage/for-your-page/services/for-your-page.service';
import { ForYourPageDTO } from 'src/modules/homepage/for-your-page/dto/for-your-page.dto';

@Injectable()
export class ArticleService
    extends AppError
    implements ArticleServiceInterface
{
    constructor(
        private readonly prisma: PrismaLearningService,
        private readonly articleSearchService: ArticlesearchService,
        private readonly learningFuseService: LearningFuseService,
        private readonly fypService: ForYourPageService,
    ) {
        super(ArticleService.name);
    }

    //Get Article By Personal Number
    async getArticleByPersonalNumber(
        page: number,
        limit: number,
        personalNumber: string,
        search?: string,
        sortBy?: string,
    ): Promise<ResponseDTO<Article[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const by_order = [];

        if (sortBy === 'trending') {
            by_order.push({
                articleComment: {
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
        if (sortBy === 'asc') {
            by_order.push({
                createdAt: 'asc',
            });
        }

        const result = await this.prisma.article.findMany({
            where: {
                AND: [
                    { personalNumber: personalNumber },
                    {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            { unit: { contains: search, mode: 'insensitive' } },
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
                articleCategory: true,
                articleComment: {
                    include: {
                        childComment: true,
                    },
                },
                _count: {
                    select: {
                        articleComment: true,
                    },
                },
            },
        });
        this.handlingErrorEmptyData(result, 'Article');
        const total = await this.prisma.article.count({
            where: {
                AND: [
                    { personalNumber: personalNumber },
                    {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            { unit: { contains: search, mode: 'insensitive' } },
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
                                ],
                            },
                        ],
                    },
                ],
            },
        });
        const data: ResponseDTO<Article[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Get Article
    async getArticle(
        page: number,
        limit: number,
        articleCategoryId: number,
        search?: string,
        sortBy?: string,
        isAdmin?: string,
    ): Promise<ResponseDTO<Article[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const by_order = [];

        if (sortBy === 'trending') {
            by_order.push({
                articleComment: {
                    _count: 'desc',
                },
            });
            by_order.push({
                createdAt: 'desc',
            });
        }
        if (sortBy == 'desc') {
            by_order.push({
                createdAt: 'desc',
            });
        }
        if (sortBy == 'asc') {
            by_order.push({
                createdAt: 'asc',
            });
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

        //By Category
        if (sortBy === 'categoryASC') {
            by_order.push({
                articleCategory: {
                    title: 'asc',
                },
            });
        }
        if (sortBy === 'categoryDESC') {
            by_order.push({
                articleCategory: {
                    title: 'desc',
                },
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
            if (articleCategoryId) {
                const result = await this.prisma.article.findMany({
                    where: {
                        articleCategoryId: articleCategoryId,
                        OR: [
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
                                approvalBy: {
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
                                AND: [
                                    // { articleCategoryId: articleCategoryId },
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
                                        approvalBy: {
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
                                ],
                            },
                        ],
                    },
                    take: take,
                    skip: skip,
                    orderBy: by_order,
                    include: {
                        articleCategory: true,
                        articleComment: {
                            where: {
                                parentId: null,
                            },
                            include: {
                                childComment: true,
                                _count: {
                                    select: {
                                        childComment: true,
                                    },
                                },
                            },
                        },
                        _count: {
                            select: {
                                articleComment: true,
                            },
                        },
                    },
                });
                this.handlingErrorEmptyData(result, 'Article');
                const total = await this.prisma.article.count({
                    where: {
                        articleCategoryId: articleCategoryId,
                        OR: [
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
                                approvalBy: {
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
                                        approvalBy: {
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
                                ],
                            },
                        ],
                    },
                });
                const data: ResponseDTO<Article[]> = {
                    result: result,
                    total: total,
                };
                return data;
            } else {
                const result = await this.prisma.article.findMany({
                    where: {
                        OR: [
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
                                approvalBy: {
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
                                AND: [
                                    // { articleCategoryId: articleCategoryId },
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
                                        approvalBy: {
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
                                ],
                            },
                        ],
                    },
                    take: take,
                    skip: skip,
                    orderBy: by_order,
                    include: {
                        articleCategory: true,
                        articleComment: {
                            where: {
                                parentId: null,
                            },
                            include: {
                                childComment: true,
                                _count: {
                                    select: {
                                        childComment: true,
                                    },
                                },
                            },
                        },
                        _count: {
                            select: {
                                articleComment: true,
                            },
                        },
                    },
                });
                this.handlingErrorEmptyData(result, 'Article');
                const total = await this.prisma.article.count({
                    where: {
                        OR: [
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
                                approvalBy: {
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
                                        approvalBy: {
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
                                ],
                            },
                        ],
                    },
                });
                const data: ResponseDTO<Article[]> = {
                    result: result,
                    total: total,
                };
                return data;
            }
        } else {
            if (articleCategoryId) {
                const result = await this.prisma.article.findMany({
                    where: {
                        articleCategoryId: articleCategoryId,
                        approvalStatus: true,
                        bannedStatus: false,
                        OR: [
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
                                approvalBy: {
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
                                AND: [
                                    // { articleCategoryId: articleCategoryId },
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
                                        approvalBy: {
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
                                ],
                            },
                        ],
                    },
                    take: take,
                    skip: skip,
                    orderBy: by_order,
                    include: {
                        articleCategory: true,
                        articleComment: {
                            where: {
                                parentId: null,
                            },
                            include: {
                                childComment: true,
                                _count: {
                                    select: {
                                        childComment: true,
                                    },
                                },
                            },
                        },
                        _count: {
                            select: {
                                articleComment: true,
                            },
                        },
                    },
                });
                this.handlingErrorEmptyData(result, 'Article');
                const total = await this.prisma.article.count({
                    where: {
                        articleCategoryId: articleCategoryId,
                        approvalStatus: true,
                        bannedStatus: false,
                        OR: [
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
                                approvalBy: {
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
                                        approvalBy: {
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
                                ],
                            },
                        ],
                    },
                });
                const data: ResponseDTO<Article[]> = {
                    result: result,
                    total: total,
                };
                return data;
            } else {
                const result = await this.prisma.article.findMany({
                    where: {
                        approvalStatus: true,
                        bannedStatus: false,
                        OR: [
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
                                approvalBy: {
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
                                AND: [
                                    // { articleCategoryId: articleCategoryId },
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
                                        approvalBy: {
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
                                ],
                            },
                        ],
                    },
                    take: take,
                    skip: skip,
                    orderBy: by_order,
                    include: {
                        articleCategory: true,
                        articleComment: {
                            where: {
                                parentId: null,
                            },
                            include: {
                                childComment: true,
                                _count: {
                                    select: {
                                        childComment: true,
                                    },
                                },
                            },
                        },
                        _count: {
                            select: {
                                articleComment: true,
                            },
                        },
                    },
                });
                this.handlingErrorEmptyData(result, 'Article');
                const total = await this.prisma.article.count({
                    where: {
                        approvalStatus: true,
                        bannedStatus: false,
                        OR: [
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
                                approvalBy: {
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
                                        approvalBy: {
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
                                ],
                            },
                        ],
                    },
                });
                const data: ResponseDTO<Article[]> = {
                    result: result,
                    total: total,
                };
                return data;
            }
        }
    }

    //Get Article By Id
    async getArticleById(uuid: string): Promise<Article> {
        const result = await this.prisma.article.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                articleCategory: true,
                _count: {
                    select: {
                        articleComment: true,
                    },
                },
            },
        });
        this.handlingErrorNotFound(result, uuid, 'Article');
        return result;
    }

    //Create Article
    async createArticle(dto: ArticleDTO): Promise<Article> {
        const findData = await this.prisma.categoryArticle.findFirst({
            where: {
                id: dto.articleCategoryId,
            },
        });
        if (!findData) {
            unlinkSync(`./uploads/${dto.path}`);
        }
        this.handlingErrorNotFound(
            findData,
            dto.articleCategoryId,
            'Category Article',
        );
        await this.learningFuseService.createCheck(dto.title);

        const article: Article = await this.prisma.article.create({
            data: {
                title: dto.title,
                personalNumber: dto.personalNumber,
                content: dto.content,
                image: dto.image,
                path: dto.path,
                articleCategoryId: dto.articleCategoryId,
                score: 25,
                uploadBy: dto.uploadBy,
                unit: dto.unit,
                approvalStatus: dto.approvalStatus,
                approvalDesc: dto.approvalDesc,
                approvalBy: dto.approvalBy,
                editorChoice: dto.editorChoice,
                bannedStatus: false,
                favorite: false,
            },
        });

        // Add article to elasticsearch
        this.articleSearchService.indexArticle(article);
        return article;
    }

    // Searching use elasticsearch
    async searchArticle(query: string): Promise<Record<string, any>> {
        return await this.articleSearchService.search(query);
    }

    //Update Article
    async updateArticle(uuid: string, dto: ArticleDTO): Promise<Article> {
        const category = await this.prisma.categoryArticle.findFirst({
            where: {
                id: dto.articleCategoryId,
            },
        });
        if (!category) {
            unlinkSync(`./uploads/${dto.path}`);
        }
        this.handlingErrorNotFound(
            category,
            dto.articleCategoryId,
            'Category Article',
        );

        const findData = await this.prisma.article.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Article');
        unlinkSync(`./uploads/${findData.path}`);
        await this.fypService.deleteForYourPage(findData.uuid);
        const article = await this.prisma.article.update({
            where: {
                uuid: uuid,
            },
            data: {
                title: dto.title,
                personalNumber: dto.personalNumber,
                content: dto.content,
                image: dto.image,
                path: dto.path,
                articleCategoryId: dto.articleCategoryId,
                approvalStatus: null,
            },
        });

        await this.articleSearchService.update(article);
        return article;
    }

    //Delete Article
    async deleteArticle(uuid: string): Promise<Article> {
        const findData = await this.prisma.article.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Article');
        unlinkSync(`./uploads/${findData.path}`);
        await this.fypService.deleteForYourPage(findData.uuid);
        const deleted = await this.prisma.article.delete({
            where: {
                uuid: uuid,
            },
        });

        await this.articleSearchService.remove(uuid);
        return deleted;
    }

    //Admin Method

    //Approve or Reject Article
    async approvalRejection(
        uuid: string,
        dto: ArticleStatusDTO,
    ): Promise<Article> {
        const findData = await this.prisma.article.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Article');
        if (dto.status == true) {
            const fyp: ForYourPageDTO = {
                uuid: findData.uuid,
                idContent: findData.id,
                title: findData.title,
                description: findData.content,
                personalNumber: findData.personalNumber,
                personalName: findData.uploadBy,
                path: findData.path,
                link: '/user/nex-learning/article/',
                category: 'article',
                cover: null,
            };
            await this.fypService.createForYourPage(fyp);
            return await this.prisma.article.update({
                where: {
                    uuid: uuid,
                },
                data: {
                    approvalStatus: true,
                    approvalDesc: dto.descStatus,
                    approvalBy: dto.approvalBy,
                    approvalPersonalNumber: dto.approvalByPersonalNumber,
                },
            });
        }
        if (dto.status == false) {
            await this.fypService.deleteForYourPage(findData.uuid);
            return await this.prisma.article.update({
                where: {
                    uuid: uuid,
                },
                data: {
                    approvalStatus: false,
                    approvalDesc: dto.descStatus,
                    approvalBy: dto.approvalBy,
                },
            });
        }
    }

    //Editor Choice
    async editorChoice(uuid: string, dto: ArticleStatusDTO): Promise<Article> {
        const findData = await this.prisma.article.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Article');
        return await this.prisma.article.update({
            where: {
                uuid: uuid,
            },
            data: {
                editorChoice: dto.status ? true : false,
            },
        });
    }

    //Active or Deadactive
    async activeDeactive(
        uuid: string,
        dto: ArticleStatusDTO,
    ): Promise<Article> {
        const findData = await this.prisma.article.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Article');
        if (dto.status == true) {
            await this.fypService.deleteForYourPage(findData.uuid);
        }
        if (dto.status == false) {
            const fyp: ForYourPageDTO = {
                uuid: findData.uuid,
                idContent: findData.id,
                title: findData.title,
                description: findData.content,
                personalNumber: findData.personalNumber,
                personalName: findData.uploadBy,
                path: findData.path,
                link: '/user/nex-learning/article/',
                category: 'article',
                cover: null,
            };
            await this.fypService.createForYourPage(fyp);
        }
        return await this.prisma.article.update({
            where: {
                uuid: uuid,
            },
            data: {
                bannedStatus: dto.status,
            },
        });
    }

    async getStatisticArticle(): Promise<StatisticArticleDTO> {
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

        const allTime = await this.prisma.article.count();
        const thisMonth = await this.prisma.article.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });
        const lastMonth = await this.prisma.article.count({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        });
        const published = await this.prisma.article.count({
            where: {
                approvalStatus: true,
            },
        });
        const needApproval = await this.prisma.article.count({
            where: {
                approvalStatus: null,
            },
        });

        const data: StatisticArticleDTO = {
            allTime: allTime,
            thisMonth: thisMonth,
            published: published,
            needApproval: needApproval,
            percent: ((thisMonth - lastMonth) / thisMonth) * 100,
        };
        return data;
    }
}
