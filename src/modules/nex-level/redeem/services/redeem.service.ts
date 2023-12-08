import { BadRequestException, Injectable } from '@nestjs/common';
import { RedeemServiceInterface } from '../interface/redeem.services.interface';
import { Redeems } from '@prisma/clients/nex-level';
import { RedeedUpdateDTO, RedeemDTO } from '../dtos/redeem.dto';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from 'src/core/errors/app.error';
import { ResponseDTO } from 'src/core/dtos/response.dto';

@Injectable()
export class RedeemService extends AppError implements RedeemServiceInterface {
    constructor(private readonly prisma: PrismaLevelService) {
        super(RedeemService.name);
    }

    async getRedeemByPersonalNumber(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
        personalNumber: string,
    ): Promise<ResponseDTO<Redeems[]>> {
        const orderBy = [];
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        if (sortBy === 'asc') {
            orderBy.push({
                createdAt: 'asc',
            });
        }

        if (sortBy === 'desc') {
            orderBy.push({
                createdAt: 'desc',
            });
        }

        const result = await this.prisma.redeems.findMany({
            where: {
                AND: [
                    { personalNumber: personalNumber },
                    {
                        OR: [
                            {
                                merchandiseRedeem: {
                                    OR: [
                                        {
                                            title: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                AND: [
                                    {
                                        merchandiseRedeem: {
                                            OR: [
                                                {
                                                    title: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            orderBy: orderBy,
            take: take,
            skip: skip,
            include: {
                merchandiseRedeem: {
                    include: {
                        imageMerchandise: true,
                    },
                },
            },
        });
        this.handlingErrorEmptyData(result, 'redeem');
        const total = await this.prisma.redeems.count({
            where: {
                OR: [
                    { personalName: { contains: search, mode: 'insensitive' } },
                    { personalUnit: { contains: search, mode: 'insensitive' } },
                    {
                        personalEmail: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        merchandiseRedeem: {
                            OR: [
                                {
                                    title: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    },
                    {
                        AND: [
                            {
                                personalName: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalUnit: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalEmail: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                merchandiseRedeem: {
                                    OR: [
                                        {
                                            title: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
        });
        const data: ResponseDTO<Redeems[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    async getRedeemByUuid(uuid: string): Promise<Redeems> {
        const result = await this.prisma.redeems.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                merchandiseRedeem: {
                    include: {
                        imageMerchandise: true,
                    },
                },
            },
        });
        this.handlingErrorNotFound(result, uuid, 'redeem');
        return result;
    }

    async getRedeem(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
    ): Promise<ResponseDTO<Redeems[]>> {
        const orderBy = [];
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        if (sortBy === 'asc') {
            orderBy.push({
                createdAt: 'asc',
            });
        }

        if (sortBy === 'desc') {
            orderBy.push({
                createdAt: 'desc',
            });
        }

        const result = await this.prisma.redeems.findMany({
            where: {
                OR: [
                    {
                        merchandiseRedeem: {
                            OR: [
                                {
                                    title: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    },
                    {
                        AND: [
                            {
                                merchandiseRedeem: {
                                    OR: [
                                        {
                                            title: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            orderBy: orderBy,
            take: take,
            skip: skip,
            include: {
                merchandiseRedeem: {
                    include: {
                        imageMerchandise: true,
                    },
                },
            },
        });
        this.handlingErrorEmptyData(result, 'redeem');
        const total = await this.prisma.redeems.count({
            where: {
                OR: [
                    { personalName: { contains: search, mode: 'insensitive' } },
                    { personalUnit: { contains: search, mode: 'insensitive' } },
                    {
                        personalEmail: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        merchandiseRedeem: {
                            OR: [
                                {
                                    title: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    },
                    {
                        AND: [
                            {
                                personalName: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalUnit: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalEmail: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                merchandiseRedeem: {
                                    OR: [
                                        {
                                            title: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
        });
        const data: ResponseDTO<Redeems[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    async createRedeem(dto: RedeemDTO): Promise<Redeems> {
        const userPoint = await this.prisma.point.findFirst({
            where: {
                personalNumber: dto.personalNumber,
            },
        });
        const findData = await this.prisma.merchandise.findFirst({
            where: {
                id: dto.merchandiseId,
            },
        });
        if (userPoint.point < findData.point) {
            throw new BadRequestException("You can't redeem it");
        } else {
            await this.prisma.point.update({
                where: {
                    uuid: userPoint.uuid,
                },
                data: {
                    point: userPoint.point - findData.point,
                },
            });
            const pcs = await this.prisma.merchandise.findFirst({
                where: {
                    id: dto.merchandiseId,
                },
            });
            await this.prisma.merchandise.update({
                where: {
                    id: dto.merchandiseId,
                },
                data: {
                    qty: pcs.qty - 1,
                },
            });
            this.handlingErrorNotFound(
                findData,
                dto.merchandiseId,
                'merchandise',
            );
            return await this.prisma.redeems.create({
                data: {
                    ...dto,
                    status: null,
                    redeemDate: null,
                    claimStatus: null
                },
            });
        }
    }

    async updateRedeemByUUID(
        uuid: string,
        dto: RedeedUpdateDTO,
    ): Promise<Redeems> {
        const findData = await this.prisma.redeems.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Redeem');
        return await this.prisma.redeems.update({
            where: {
                uuid: uuid,
            },
            data: {
                ...dto,
                redeemDate: new Date(dto.redeemDate),
            },
        });
    }

    async deleteRedeemByUUID(uuid: string): Promise<Redeems> {
        const findData = await this.prisma.redeems.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Redeem');
        return await this.prisma.redeems.delete({
            where: {
                uuid: uuid,
            },
        });
    }
}
