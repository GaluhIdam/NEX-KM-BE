import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { ArticleCategoryServiceInterface } from '../interfaces/article-category.service.interface';
import { CategoryArticle } from '@prisma/clients/nex-learning';
import {
    ArticleCategoryDTO,
    ArticleCategoryStatusDTO,
} from '../dtos/article-category.dto';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { LearningFuseService } from '../../fuse/learning.fuse.service';

@Injectable()
export class ArticleCategoryService
    extends AppError
    implements ArticleCategoryServiceInterface
{
    constructor(
        private readonly prisma: PrismaLearningService,
        private readonly learningFuseService: LearningFuseService,
    ) {
        super(ArticleCategoryService.name);
    }

    //Get Category Article
    async getCategoryArticle(
        page?: number,
        limit?: number,
        search?: string,
        optionx?: string,
    ): Promise<ResponseDTO<CategoryArticle[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        if (optionx === 'true') {
            const result = await this.prisma.categoryArticle.findMany({
                where: {
                    title: { contains: search, mode: 'insensitive' },
                    status: true,
                },
            });
            const total = await this.prisma.categoryArticle.count({
                where: {
                    title: { contains: search, mode: 'insensitive' },
                    status: true,
                },
            });
            this.handlingErrorEmptyData(result, 'Category Article');
            const data: ResponseDTO<CategoryArticle[]> = {
                result: result,
                total: total,
            };
            return data;
        } else {
            const result = await this.prisma.categoryArticle.findMany({
                where: {
                    title: { contains: search, mode: 'insensitive' },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            const total = await this.prisma.categoryArticle.count({
                where: {
                    title: { contains: search, mode: 'insensitive' },
                },
            });
            this.handlingErrorEmptyData(result, 'Category Article');
            const data: ResponseDTO<CategoryArticle[]> = {
                result: result,
                total: total,
            };
            return data;
        }
    }

    //Create Article Category
    async createCategoryArticle(
        dto: ArticleCategoryDTO,
    ): Promise<CategoryArticle> {
        await this.learningFuseService.createCheck(dto.title);
        const categoryArticle = await this.prisma.categoryArticle.create({
            data: {
                title: dto.title
                    .split(/\s+/)
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                personalNumber: dto.personalNumber,
                status: dto.status,
            },
        });

        return categoryArticle;
    }

    //Update Article Category
    async updateCategoryArticle(
        uuid: string,
        dto: ArticleCategoryDTO,
    ): Promise<CategoryArticle> {
        const findData = await this.prisma.categoryArticle.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Category Article');
        return await this.prisma.categoryArticle.update({
            where: {
                uuid: uuid,
            },
            data: {
                title: dto.title,
            },
        });
    }

    //Delete Category Article
    async deleteCategoryArticle(uuid: string): Promise<CategoryArticle> {
        const findData = await this.prisma.categoryArticle.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Category Article');
        return await this.prisma.categoryArticle.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    //Active or Deactive Status
    async activeDeactive(
        uuid: string,
        dto: ArticleCategoryStatusDTO,
    ): Promise<CategoryArticle> {
        const findData = await this.prisma.categoryArticle.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Category Article');
        return await this.prisma.categoryArticle.update({
            where: {
                uuid: uuid,
            },
            data: {
                status: dto.status,
            },
        });
    }
}
