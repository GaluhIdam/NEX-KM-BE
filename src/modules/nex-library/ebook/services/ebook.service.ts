import { Injectable } from '@nestjs/common';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { EbookServiceInterface } from '../interfaces/ebook.service.interface';
import { Ebook } from '@prisma/clients/nex-library';
import { EbookDTO, QueryParamsDto } from '../dtos/ebook.dto';
import { AppError } from 'src/core/errors/app.error';
import { unlinkSync } from 'fs';
import { subMonths } from 'date-fns';
import { EbookStatusDTO } from '../dtos/ebook-status';
import { EbookEditorChoiceDTO } from '../dtos/ebook-editor-choice.dto';
import { EbookStatusApprovalDTO } from '../dtos/ebook-status-approval.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
import { EbookSearchService } from './ebook-search.service';
import { Workbook } from 'exceljs';

@Injectable()
export class EbookService extends AppError implements EbookServiceInterface {
    constructor(
        private readonly prisma: PrismaLibraryService,
        private readonly ebookSearchService: EbookSearchService,
    ) {
        super(EbookService.name);
    }

    //Get Ebook
    async getEbook(
        page: number,
        limit: number,
        search?: string,
        id_ebook_category?: number,
        personalNumber?: string,
        sortBy?: string,
        status?: boolean,
        approvalStatus?: string,
    ): Promise<PaginationDTO<Ebook[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const by_order = {};

        const threeMonthsAgo = subMonths(new Date(), 3);

        if (sortBy == 'desc' || sortBy == 'asc') {
            by_order['createdAt'] = sortBy;
        }
        if (sortBy == 'trending') {
            by_order['ebooksEbookReviews'] = {
                _count: 'desc',
            };
        }

        let where = {};

        const filters = [];

        if (status !== null) {
            filters.push({ status: status });
        }

        if (id_ebook_category) {
            filters.push({ ebookCategoryId: id_ebook_category });
        }

        if (personalNumber) {
            filters.push({ personalNumber: personalNumber });
        }

        if (approvalStatus) {
            filters.push({ approvalStatus: approvalStatus });
        }

        if (sortBy === 'trending') {
            filters.push({
                createdAt: { gte: threeMonthsAgo },
            });
        }

        if (search) {
            filters.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { synopsis: { contains: search, mode: 'insensitive' } },
                    { overview: { contains: search, mode: 'insensitive' } },
                    { author: { contains: search, mode: 'insensitive' } },
                    { aboutAuthor: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                synopsis: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                overview: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                author: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                aboutAuthor: {
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

        const result = await this.prisma.ebook.findMany({
            where: where,
            take: take,
            skip: skip,
            orderBy: by_order,
            include: {
                ebooksEbookCategories: true,
                ebooksEbookReviews: true,
            },
        });

        const totalItems = result.length;
        const totalPages = Math.ceil(totalItems / take);

        const response: PaginationDTO<Ebook[]> = {
            page: Number(page),
            limit: take,
            totalItems: totalItems,
            totalPages: totalPages,
            data: result,
        };

        this.handlingErrorEmptyDataPagination(response, 'Ebook');
        return response;
    }

    //Get Ebook By ID
    async getEbookById(uuid: string): Promise<Ebook> {
        const result = await this.prisma.ebook.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                ebooksEbookCategories: true,
                ebooksEbookReviews: true,
            },
        });
        this.handlingErrorNotFound(result, uuid, 'Ebook');
        return result;
    }

    //Create Ebook
    async createEbook(dto: EbookDTO): Promise<Ebook> {
        try {
            const findData = await this.prisma.ebookCategories.findFirst({
                where: {
                    id: dto.ebook_category,
                },
            });
            this.handlingErrorNotFound(
                findData,
                dto.ebook_category,
                'Ebook Category',
            );
        } catch (error) {
            unlinkSync(`./uploads/${dto.path_ebook}`);
            unlinkSync(`./uploads/${dto.path_cover}`);
            throw error;
        }
        const ebook: Ebook = await this.prisma.ebook.create({
            data: {
                ebookCategoryId: dto.ebook_category,
                ebookFile: dto.ebook_file,
                title: dto.title,
                ebookCover: dto.ebook_cover,
                synopsis: dto.synopsis,
                overview: dto.overview,
                author: dto.author,
                aboutAuthor: dto.about_author,
                personalNumber: dto.personalNumber,
                uploadBy: dto.upload_by,
                unit: dto.unit,
                viewCount: 0,
                approvalStatus: 'Waiting Approval',
                descStatus: 'The ebook has not been approved by the admin yet.',
                approvalBy: null,
                editorChoice: false,
                status: true,
                pathCover: dto.path_cover,
                pathEbook: dto.path_ebook,
            },
        });

        this.ebookSearchService.indexEbook(ebook);
        return ebook;
    }

    //Update Ebook (General)
    async updateEbook(uuid: string, dto: EbookDTO): Promise<Ebook> {
        try {
            const findData = await this.prisma.ebookCategories.findFirst({
                where: {
                    id: dto.ebook_category,
                },
            });
            this.handlingErrorNotFound(
                findData,
                dto.ebook_category,
                'Ebook Category',
            );
            const findData2 = await this.prisma.ebook.findFirst({
                where: {
                    uuid: uuid,
                },
            });
            this.handlingErrorNotFound(findData2, uuid, 'Ebook');
            if (findData2) {
                unlinkSync(`./uploads/${findData2.pathCover}`);
                unlinkSync(`./uploads/${findData2.pathEbook}`);
            }
        } catch (error) {
            unlinkSync(`./uploads/${dto.path_ebook}`);
            unlinkSync(`./uploads/${dto.path_cover}`);
            throw error;
        }
        const ebook: Ebook = await this.prisma.ebook.update({
            where: {
                uuid: uuid,
            },
            data: {
                ebookCategoryId: dto.ebook_category,
                ebookFile: dto.ebook_file,
                title: dto.title,
                ebookCover: dto.ebook_cover,
                synopsis: dto.synopsis,
                overview: dto.overview,
                author: dto.author,
                aboutAuthor: dto.about_author,
                personalNumber: dto.personalNumber,
                uploadBy: dto.upload_by,
                unit: dto.unit,
                pathCover: dto.path_cover,
                pathEbook: dto.path_ebook,
            },
        });

        await this.ebookSearchService.update(ebook);
        return ebook;
    }

    //Update Ebook Status Approval
    async updateEbookStatusApproval(
        uuid: string,
        dto: EbookStatusApprovalDTO,
    ): Promise<Ebook> {
        const findData = await this.prisma.ebook.findFirst({
            where: {
                uuid: uuid,
            },
        });

        this.handlingErrorNotFound(findData, uuid, 'Ebook');
        const ebook: Ebook = await this.prisma.ebook.update({
            where: {
                uuid: uuid,
            },
            data: {
                approvalStatus: dto.approvalStatus,
                approvalBy: dto.approvalBy,
                descStatus: dto.descStatus ?? '',
            },
        });

        await this.ebookSearchService.update(ebook);
        return ebook;
    }

    //Update Status Ebook
    async updateEbookStatus(uuid: string, dto: EbookStatusDTO): Promise<Ebook> {
        const findData = await this.prisma.ebook.findFirst({
            where: {
                uuid: uuid,
            },
        });

        this.handlingErrorNotFound(findData, uuid, 'Ebook');
        const ebook: Ebook = await this.prisma.ebook.update({
            where: {
                uuid: uuid,
            },
            data: {
                status: dto.status,
            },
        });

        await this.ebookSearchService.update(ebook);
        return ebook;
    }

    //Update Editor Choice Ebook
    async updateEbookEditorChoice(
        uuid: string,
        dto: EbookEditorChoiceDTO,
    ): Promise<Ebook> {
        const findData = await this.prisma.ebook.findFirst({
            where: {
                uuid: uuid,
            },
        });

        this.handlingErrorNotFound(findData, uuid, 'Ebook');
        const ebook: Ebook = await this.prisma.ebook.update({
            where: {
                uuid: uuid,
            },
            data: {
                editorChoice: dto.editor_choice,
            },
        });

        await this.ebookSearchService.update(ebook);
        return ebook;
    }

    //Delete Ebook
    async deleteEbook(uuid: string): Promise<Ebook> {
        const findData = await this.prisma.ebook.findFirst({
            where: {
                uuid: uuid,
            },
        });

        //Checking Data Ebook
        this.handlingErrorNotFound(findData, uuid, 'Ebook');
        const deleted = await this.prisma.ebook.delete({
            where: {
                uuid: uuid,
            },
        });

        await this.ebookSearchService.remove(uuid);
        return deleted;
    }

    //Update View Ebook
    async updateViewEbook(uuid: string): Promise<Ebook> {
        const findData = await this.prisma.ebook.findFirst({
            where: {
                uuid: uuid,
            },
        });

        this.handlingErrorNotFound(findData, uuid, 'Ebook');
        const updated = await this.prisma.ebook.update({
            where: {
                uuid: uuid,
            },
            data: {
                viewCount: findData.viewCount + 1,
            },
        });

        await this.ebookSearchService.update(updated);
        return updated;
    }

    async search(query: string): Promise<Record<string, any>> {
        return await this.ebookSearchService.search(query);
    }

    async exportExcel(queryParams: QueryParamsDto): Promise<any> {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Ebooks');
        worksheet.columns = [
            { header: 'No', key: 'no' },
            { header: 'Uploaded Time', key: 'createdAt' },
            { header: 'Title', key: 'title' },
            { header: 'Author', key: 'author' },
            { header: 'Category', key: 'ebooksEbookCategories.name' },
            { header: 'Uploaded By', key: 'uploadBy' },
            { header: 'Unit', key: 'unit' },
            { header: 'Approval Status', key: 'approvalStatus' },
            { header: 'Approval Message', key: 'descriptionStatus' },
            { header: 'Approved By', key: 'approvalBy' },
            { header: 'Overview', key: 'overview' },
            { header: 'Rating', key: 'rating' },
            { header: 'Editor Choice', key: 'editorChoice' },
            { header: 'Score', key: 'score' },
            { header: 'Status', key: 'status' },
        ];

        const {
            approvalStatus,
            approvedBy,
            author,
            category,
            personnelNumber,
            status,
            unit,
            uploadedBy,
            startDate,
            endDate,
        } = queryParams;
        const ebooks: Ebook[] = await this.prisma.ebook.findMany({
            where: {
                OR: [
                    {
                        ...(category && { ebookCategoryId: category }),
                    },
                    {
                        ...(approvalStatus && {
                            approvalStatus: {
                                contains: approvalStatus,
                                mode: 'insensitive',
                            },
                        }),
                    },
                    {
                        ...(approvedBy && {
                            approvalBy: {
                                contains: approvedBy,
                                mode: 'insensitive',
                            },
                        }),
                    },
                    {
                        ...(author && {
                            author: { contains: author, mode: 'insensitive' },
                        }),
                    },
                    {
                        ...(personnelNumber && {
                            personalNumber: personnelNumber,
                        }),
                    },
                    { ...(status || status === false ? { status } : '') },
                    {
                        ...(unit && {
                            unit: { contains: unit, mode: 'insensitive' },
                        }),
                    },
                    {
                        ...(uploadedBy && {
                            uploadBy: {
                                contains: uploadedBy,
                                mode: 'insensitive',
                            },
                        }),
                    },
                    {
                        ...(startDate &&
                            endDate && {
                            createdAt: {
                                lte: new Date(endDate),
                                gte: new Date(startDate),
                            },
                        }),
                    },
                ],
                AND: [
                    {
                        ...(category && { ebookCategoryId: category }),
                    },
                    {
                        ...(approvalStatus && {
                            approvalStatus: {
                                contains: approvalStatus,
                                mode: 'insensitive',
                            },
                        }),
                    },
                    {
                        ...(approvedBy && {
                            approvalBy: {
                                contains: approvedBy,
                                mode: 'insensitive',
                            },
                        }),
                    },
                    {
                        ...(author && {
                            author: {
                                contains: author,
                                mode: 'insensitive',
                            },
                        }),
                    },
                    {
                        ...(personnelNumber && {
                            personalNumber: personnelNumber,
                        }),
                    },
                    { ...(status || status === false ? { status } : '') },
                    {
                        ...(unit && {
                            unit: {
                                contains: unit,
                                mode: 'insensitive',
                            },
                        }),
                    },
                    {
                        ...(uploadedBy && {
                            uploadBy: {
                                contains: uploadedBy,
                                mode: 'insensitive',
                            },
                        }),
                    },
                    {
                        ...(startDate &&
                            endDate && {
                            createdAt: {
                                lte: new Date(endDate),
                                gte: new Date(startDate),
                            },
                        }),
                    },
                ],
            },
            include: {
                ebooksEbookCategories: true,
                ebooksEbookReviews: true,
            },
        });

        ebooks.forEach((ebook) => {
            worksheet.addRow(ebook);
        });
        const buffer = await workbook.xlsx.writeBuffer();

        return buffer;
    }
}
