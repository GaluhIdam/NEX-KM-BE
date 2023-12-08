import { Injectable } from '@nestjs/common';
import { EbookCategoryServiceInterface } from '../interfaces/ebook-category.service.interface';
import { EbookCategories } from '@prisma/clients/nex-library';
import { EbookCategoryDTO } from '../dtos/ebook-category.dto';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { AppError } from 'src/core/errors/app.error';
import { EbookCategoryStatusDTO } from '../dtos/ebook-category-status.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';

@Injectable()
export class EbookCategoryService
    extends AppError
    implements EbookCategoryServiceInterface
{
    constructor(private readonly prisma: PrismaLibraryService) {
        super(EbookCategoryService.name);
    }

    //Get Ebook Category
    async getEbookCategory(
        page: number,
        limit: number,
        search?: string,
        is_active?: boolean,
        sort_by?: string,
    ): Promise<PaginationDTO<EbookCategories[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const by_order = {};

        if (sort_by == 'desc' || sort_by == 'asc') {
            by_order['createdAt'] = sort_by;
        } else if (sort_by === 'popular') {
            by_order['ebookCategoriesEbooks'] = {
                _count: 'desc',
            };
        }

        let where = undefined;

        if (is_active !== null) {
            if (search) {
                where = {
                    AND: [
                        { OR: [{ isActive: is_active }] },
                        {
                            OR: [
                                {
                                    name: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    AND: [
                                        {
                                            name: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                };
            } else {
                where = {
                    AND: [{ OR: [{ isActive: is_active }] }],
                };
            }
        } else {
            if (search) {
                where = {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        {
                            AND: [
                                {
                                    name: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    ],
                };
            }
        }

        const result = await this.prisma.ebookCategories.findMany({
            where: where,
            take: take,
            skip: skip,
            orderBy: by_order,
            include: {
                ebookCategoriesEbooks: true,
            },
        });

        const totalItems = await this.prisma.ebookCategories.count({ where });
        const totalPages = Math.ceil(totalItems / take);

        const response: PaginationDTO<EbookCategories[]> = {
            page: Number(page),
            limit: take,
            totalItems: totalItems,
            totalPages: totalPages,
            data: result,
        };

        this.handlingErrorEmptyDataPagination(response, 'EBook Category');
        return response;
    }

    //Get Ebook Category
    async getEbookCategoryById(
        id_ebook_category: number,
    ): Promise<EbookCategories> {
        const result = await this.prisma.ebookCategories.findFirst({
            where: {
                id: id_ebook_category,
            },
        });
        this.handlingErrorNotFound(result, id_ebook_category, 'Ebook Category');
        return result;
    }

    //Create Ebook Category
    async createEbookCategory(dto: EbookCategoryDTO): Promise<EbookCategories> {
        return await this.prisma.ebookCategories.create({
            data: {
                name: dto.name,
                personalNumber: dto.personalNumber,
                isActive: true,
            },
        });
    }

    //Update Ebook Category
    async updateEbookCategory(
        uuid: string,
        dto: EbookCategoryDTO,
    ): Promise<EbookCategories> {
        const findData = await this.prisma.ebookCategories.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Ebook Category');
        return await this.prisma.ebookCategories.update({
            where: {
                uuid: uuid,
            },
            data: {
                name: dto.name,
                personalNumber: dto.personalNumber,
            },
        });
    }

    //Update Status Ebook Category
    async updateEbookCategoryStatus(
        uuid: string,
        dto: EbookCategoryStatusDTO,
    ): Promise<EbookCategories> {
        const findData = await this.prisma.ebookCategories.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Ebook Category');
        return await this.prisma.ebookCategories.update({
            where: {
                uuid: uuid,
            },
            data: {
                isActive: dto.isActive,
            },
        });
    }

    //Delete Ebook Category
    async deleteEbookCategory(uuid: string): Promise<EbookCategories> {
        //Checking data Ebook Category
        const findData = await this.prisma.ebookCategories.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Ebook Category');
        return await this.prisma.ebookCategories.delete({
            where: {
                uuid: uuid,
            },
        });
    }
}
