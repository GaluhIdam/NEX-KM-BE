import { Injectable } from '@nestjs/common';
import { MerchandiseServiceInterface } from '../interface/merchandise.services.interface';
import { Merchandise, MerchandiseImage } from '@prisma/clients/nex-level';
import {
    GetUsersQueryDTO,
    MerchandiseDTO,
    MerchandiseImageDTO,
    PinUnpinDTO,
} from '../dtos/merchandise.dto';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';
import { AppError } from 'src/core/errors/app.error';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { unlinkSync } from 'fs';
import { MerchandiseSearchService } from './merchandise-search.service';

@Injectable()
export class MerchandiseService
    extends AppError
    implements MerchandiseServiceInterface
{
    constructor(
        private readonly prisma: PrismaLevelService,
        private readonly merchSearchService: MerchandiseSearchService,
    ) {
        super(MerchandiseService.name);
    }

    // Searching use elasticsearch
    async searchMerchandise(query: string) {
        return await this.merchSearchService.search(query);
    }

    //Filter Merchandise
    async filterMerchandise(
        page: number,
        limit: number,
        search: string,
        minPoint: number,
        maxPoint: number,
        sortBy: string,
    ): Promise<ResponseDTO<Merchandise[]>> {
        const take = limit;
        const skip = (page - 1) * take;
        const orderBy = [];

        if (sortBy.toLocaleLowerCase() === 'asc') {
            orderBy.push({
                point: 'asc',
            });
        }

        if (sortBy.toLocaleLowerCase() === 'desc') {
            orderBy.push({
                point: 'desc',
            });
        }

        const result = await this.prisma.merchandise.findMany({
            where: {
                point: {
                    lte: maxPoint,
                    gte: minPoint,
                },
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
            },
            orderBy,
            take,
            skip,
            include: {
                imageMerchandise: true,
                _count: {
                    select: {
                        merchandiseRedeem: true,
                    },
                },
            },
        });
        this.handlingErrorEmptyData(result, 'mechandise');
        const total = await this.prisma.merchandise.count({
            where: {
                point: {
                    lte: maxPoint,
                    gte: minPoint,
                },
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
            },
        });

        const data: ResponseDTO<Merchandise[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Get Merchandise By Uuid
    async getMerchandiseByUuid(uuid: string): Promise<Merchandise> {
        const getMerch = await this.prisma.merchandise.findUnique({
            where: { uuid },
            include: {
                imageMerchandise: true,
            },
        });

        this.handlingErrorNotFound(getMerch, uuid, 'Merchandise');

        return getMerch;
    }

    //Get All Merchandise
    async getMerchandise(
        queryParams: GetUsersQueryDTO,
    ): Promise<ResponseDTO<Merchandise[]>> {
        const { limit, page, search, sortBy, minPoints, maxPoints } =
            queryParams;

        const take = limit;
        const skip = (page - 1) * take;
        const orderBy = [];

        if (sortBy.toLocaleLowerCase() === 'asc') {
            orderBy.push({
                createdAt: 'asc',
            });
        }

        if (sortBy.toLocaleLowerCase() === 'desc') {
            orderBy.push({
                createdAt: 'desc',
            });
        }

        if (sortBy == 'ascPoint') {
            orderBy.push({
                point: 'asc',
            });
            orderBy.push({
                createdAt: 'desc',
            });
        }

        if (sortBy == 'descPoint') {
            orderBy.push({
                point: 'desc',
            });
            orderBy.push({
                createdAt: 'desc',
            });
        }

        const merch = await this.prisma.merchandise.findMany({
            where: {
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
            },
            orderBy: orderBy,
            take,
            skip,
            include: {
                imageMerchandise: true,
                _count: {
                    select: { merchandiseRedeem: true },
                },
            },
        });

        this.handlingErrorEmptyData(merch, 'merchandise');

        const total = await this.prisma.merchandise.count({
            where: {
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
            },
        });

        const data: ResponseDTO<Merchandise[]> = {
            result: merch,
            total: total,
        };

        return data;
    }

    //Create Merchandise
    async createMerchandise(dto: MerchandiseDTO): Promise<Merchandise> {
        const merch: Merchandise = await this.prisma.merchandise.create({
            data: {
                ...dto,
            },
        });

        this.merchSearchService.indexMerchandise(merch);
        return merch;
    }

    //Update Merchandise
    async updateMerchandiseByUUID(
        uuid: string,
        dto: MerchandiseDTO,
    ): Promise<Merchandise> {
        const getMerch = await this.prisma.merchandise.findUnique({
            where: { uuid },
        });

        this.handlingErrorNotFound(getMerch, uuid, 'Merchandise');

        const merch: Merchandise = await this.prisma.merchandise.update({
            where: {
                uuid,
            },
            data: {
                ...dto,
            },
        });

        await this.merchSearchService.update(merch);
        return merch;
    }

    //Pin or Unpin Merchandise
    async pinUnpin(uuid: string, dto: PinUnpinDTO): Promise<Merchandise> {
        const getMerch = await this.prisma.merchandise.findUnique({
            where: { uuid },
        });

        this.handlingErrorNotFound(getMerch, uuid, 'Merchandise');

        return await this.prisma.merchandise.update({
            where: { uuid },
            data: { ...dto },
        });
    }

    //Delete Merchandise
    async deleteMerchandiseByUUID(uuid: string): Promise<Merchandise> {
        const getMerch = await this.prisma.merchandise.findUnique({
            where: { uuid },
            include: {
                imageMerchandise: true,
            },
        });

        this.handlingErrorNotFound(getMerch, uuid, 'Merchandise');
        getMerch.imageMerchandise.forEach(async (data) => {
            await this.deleteMerchandiseImage(data.uuid);
        });
        const merch = await this.prisma.merchandise.delete({
            where: {
                uuid: uuid,
            },
            include: {
                imageMerchandise: true,
            },
        });

        await this.merchSearchService.remove(uuid);
        return merch;
    }

    //Create Merchandise Image
    async createImageMerchandise(
        dto: MerchandiseImageDTO,
    ): Promise<MerchandiseImage> {
        const findData = await this.prisma.merchandise.findFirst({
            where: {
                id: dto.merchandiseId,
            },
        });
        if (!findData) {
            unlinkSync(`./uploads/${dto.path}`);
        }
        this.handlingErrorNotFound(findData, dto.merchandiseId, 'merchandise');
        return await this.prisma.merchandiseImage.create({
            data: {
                ...dto,
            },
        });
    }

    //Update Merchandise Image
    async updateImageMerchandise(
        dto: MerchandiseImageDTO,
    ): Promise<MerchandiseImage> {
        const findMerchandise = await this.prisma.merchandise.findUnique({
            where: { id: dto.merchandiseId },
        });
        this.handlingErrorNotFound(
            findMerchandise,
            dto.merchandiseId,
            'image merchandise',
        );
        return await this.prisma.merchandiseImage.create({
            data: {
                ...dto,
            },
        });
    }

    //Delete Merchandise Image
    async deleteMerchandiseImage(uuid: string): Promise<MerchandiseImage> {
        const findData = await this.prisma.merchandiseImage.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'merchandise image');
        unlinkSync(`./uploads/${findData.path}`);
        return await this.prisma.merchandiseImage.delete({
            where: {
                uuid: uuid,
            },
        });
    }
}
