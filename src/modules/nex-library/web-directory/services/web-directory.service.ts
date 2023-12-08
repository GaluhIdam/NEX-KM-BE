import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { WebDirectoryServiceInterface } from '../interfaces/web-directory.service.interface';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { WebDirectory } from '@prisma/clients/nex-library';
import { WebDirectoryDTO } from '../dtos/web-directory.dto';
import { unlinkSync } from 'fs';
import { WebDirectoryStatusDTO } from '../dtos/web-directory-status.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
import { WebdirsearchService } from './webdir-search.service';

@Injectable()
export class WebDirectoryService
    extends AppError
    implements WebDirectoryServiceInterface
{
    constructor(
        private readonly prisma: PrismaLibraryService,
        private webdirSearchService: WebdirsearchService,
    ) {
        super(WebDirectoryService.name);
    }

    async search(query: string): Promise<Record<string, any>> {
        return await this.webdirSearchService.search(query);
    }

    //Get Web Directory
    async getWebDirectory(
        page: number,
        limit: number,
        search?: string,
        id_unit?: number,
        status?: boolean,
        sortBy?: string,
        personalNumber?: string,
    ): Promise<PaginationDTO<WebDirectory[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const by_order = {};

        if (sortBy == 'desc' || sortBy == 'asc') {
            by_order['createdAt'] = sortBy;
        }

        let where = {};

        const filters = [];

        if (status !== null) {
            filters.push({ status: status });
        }

        if (id_unit) {
            filters.push({ dinasId: Number(id_unit) });
        }

        if (personalNumber) {
            filters.push({ personalNumber: personalNumber });
        }

        if (search) {
            filters.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { link: { contains: search, mode: 'insensitive' } },
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
                            { link: { contains: search, mode: 'insensitive' } },
                        ],
                    },
                ],
            });
        }

        if (filters.length > 0) {
            where = { AND: filters };
        }

        const result = await this.prisma.webDirectory.findMany({
            where: where,
            take: take,
            skip: skip,
            orderBy: by_order,
            include: {
                directoryWeb: true,
            },
        });

        const totalItems = await this.prisma.webDirectory.count({ where });
        const totalPages = Math.ceil(totalItems / take);

        const response: PaginationDTO<WebDirectory[]> = {
            page: Number(page),
            limit: take,
            totalItems: totalItems,
            totalPages: totalPages,
            data: result,
        };

        this.handlingErrorEmptyDataPagination(response, 'Web Directory');
        return response;
    }

    //Get By Id
    async getWebDirectoryById(uuid: string): Promise<WebDirectory> {
        const findData = await this.prisma.webDirectory.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Web Directory');
        return findData;
    }

    //Create Web Directory
    async createWebDirectory(dto: WebDirectoryDTO): Promise<WebDirectory> {
        const webdir: WebDirectory = await this.prisma.webDirectory.create({
            data: {
                dinasId: dto.id_unit_dinas,
                title: dto.title,
                description: dto.description,
                link: dto.link,
                cover: dto.cover,
                path: dto.path,
                personalNumber: dto.personalNumber,
                status: false,
            },
        });

        this.webdirSearchService.indexWebdir(webdir);
        return webdir;
    }

    //Update Web Directory
    async updateWebDirectory(
        uuid: string,
        dto: WebDirectoryDTO,
    ): Promise<WebDirectory> {
        const findData = await this.getWebDirectoryById(uuid);
        unlinkSync(`./uploads/${findData.path}`);
        const webdir: WebDirectory = await this.prisma.webDirectory.update({
            where: {
                uuid: uuid,
            },
            data: {
                dinasId: dto.id_unit_dinas,
                title: dto.title,
                description: dto.description,
                link: dto.link,
                cover: dto.cover,
                path: dto.path,
                personalNumber: dto.personalNumber,
            },
        });

        await this.webdirSearchService.update(webdir);
        return webdir;
    }

    //Update Status Web Directory
    async updateWebDirectoryStatus(
        uuid: string,
        dto: WebDirectoryStatusDTO,
    ): Promise<WebDirectory> {
        const findData = await this.prisma.webDirectory.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Album');
        const webdir: WebDirectory = await this.prisma.webDirectory.update({
            where: {
                uuid: uuid,
            },
            data: {
                status: dto.status,
            },
        });

        await this.webdirSearchService.update(webdir);
        return webdir;
    }

    //Delete Web Directroy
    async deleteWebDirectory(uuid: string): Promise<WebDirectory> {
        const findData = await this.getWebDirectoryById(uuid);
        unlinkSync(`./uploads/${findData.path}`);
        const webdir: WebDirectory = await this.prisma.webDirectory.delete({
            where: {
                uuid: uuid,
            },
        });

        await this.webdirSearchService.remove(uuid);
        return webdir;
    }
}
