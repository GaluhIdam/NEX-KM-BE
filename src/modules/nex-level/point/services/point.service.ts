import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PointServiceInterface } from '../interfaces/point.service.interface';
import {
    Point,
    HistoryPoint,
    HistoryPointOfYears,
} from '@prisma/clients/nex-level';
import { HistoryPointDTO, PointDTO } from '../dtos/point.dto';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';
import { ResponseDTO } from 'src/core/dtos/response.dto';

@Injectable()
export class PointService extends AppError implements PointServiceInterface {
    constructor(private readonly prisma: PrismaLevelService) {
        super(PointService.name);
    }

    //Find History Service
    async findHistoryPoint(personalNumber: string): Promise<HistoryPoint> {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return await this.prisma.historyPoint.findFirst({
            where: {
                personalNumber: personalNumber,
                activity: 'Daily Login',
                createdAt: {
                    gte: date,
                    lte: new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1),
                },
            },
        });
    }

    //Get History Point By Personal Number
    async getHistoryPointByPersonalNumber(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
        personalNumber: string,
        year: number,
    ): Promise<ResponseDTO<HistoryPoint[]>> {
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
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const result = await this.prisma.historyPoint.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                },
                personalNumber: personalNumber,
                OR: [
                    { activity: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                activity: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
            orderBy: orderBy,
            take: take,
            skip: skip,
        });
        this.handlingErrorEmptyData(result, 'history point');

        const total = await this.prisma.historyPoint.count({
            where: {
                createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                },
                personalNumber: personalNumber,
                OR: [
                    { activity: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                activity: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
        });

        const data: ResponseDTO<HistoryPoint[]> = {
            result: result,
            total: total,
        };

        return data;
    }

    //Get History
    async getHistoryPoint(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
    ): Promise<ResponseDTO<HistoryPoint[]>> {
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
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const result = await this.prisma.historyPoint.findMany({
            where: {
                OR: [
                    { activity: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                activity: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
            orderBy: orderBy,
            take: take,
            skip: skip,
        });
        this.handlingErrorEmptyData(result, 'history point');

        const total = await this.prisma.historyPoint.count({
            where: {
                OR: [
                    { activity: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                activity: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
        });

        const data: ResponseDTO<HistoryPoint[]> = {
            result: result,
            total: total,
        };

        return data;
    }

    //Create History Point
    async createHistoryPoint(dto: HistoryPointDTO): Promise<HistoryPoint> {
        return await this.prisma.historyPoint.create({
            data: {
                ...dto,
            },
        });
    }

    //Get Point By Personal Number
    async getPointByPersonalNumber(personalNumber: string): Promise<Point> {
        return await this.prisma.point.findFirst({
            where: {
                personalNumber: personalNumber,
            },
        });
    }

    //Get Point
    async getPoint(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
    ): Promise<ResponseDTO<Point[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

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

        const result = await this.prisma.point.findMany({
            where: {
                OR: [
                    { personalName: { contains: search, mode: 'insensitive' } },
                    { personalUnit: { contains: search, mode: 'insensitive' } },
                    { title: { contains: search, mode: 'insensitive' } },
                    {
                        personalEmail: {
                            contains: search,
                            mode: 'insensitive',
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
                                title: {
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
                        ],
                    },
                ],
            },
            orderBy: orderBy,
            take: take,
            skip: skip,
        });
        this.handlingErrorEmptyData(result, 'point');
        const total = await this.prisma.point.count({
            where: {
                OR: [
                    { personalName: { contains: search, mode: 'insensitive' } },
                    { personalUnit: { contains: search, mode: 'insensitive' } },
                    { title: { contains: search, mode: 'insensitive' } },
                    {
                        personalEmail: {
                            contains: search,
                            mode: 'insensitive',
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
                                title: {
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
                        ],
                    },
                ],
            },
        });

        const data: ResponseDTO<Point[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Create Point Config
    async createPoint(dto: PointDTO): Promise<Point> {
        const findData = await this.prisma.point.findFirst({
            where: {
                personalNumber: dto.personalNumber,
            },
        });
        const findDataYear = await this.prisma.historyPointOfYears.findFirst({
            where: {
                personalNumber: dto.personalNumber,
            },
        });
        if (findData) {
            return;
        }
        if (!findDataYear) {
            await this.prisma.historyPointOfYears.create({
                data: {
                    personalNumber: dto.personalNumber,
                    point: 0,
                    year: new Date().getFullYear(),
                },
            });
        }
        return await this.prisma.point.create({
            data: {
                ...dto,
                point: 0,
            },
        });
    }

    //Update Point
    async updatePoint(uuid: string, dto: PointDTO): Promise<Point> {
        const findData = await this.prisma.point.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'point');
        await this.prisma.historyPointOfYears.update({
            where: {
                personalNumber: findData.personalNumber,
            },
            data: {
                point: dto.totalPoint,
            },
        });
        return await this.prisma.point.update({
            where: {
                uuid: uuid,
            },
            data: {
                point: dto.point,
                totalPoint: dto.totalPoint,
            },
        });
    }

    //Delete Point
    async deletePoint(uuid: string): Promise<Point> {
        const findData = await this.prisma.point.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'point');
        return await this.prisma.point.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    async getPointofYear(personalNumber: string): Promise<HistoryPointOfYears> {
        return await this.prisma.historyPointOfYears.findFirst({
            where: {
                personalNumber: personalNumber,
            },
        });
    }

    //Reset Point of Years
    async resetPointOfYears(personalNumber: string): Promise<Point> {
        const nowDate = new Date();
        const cekData = await this.prisma.point.findFirst({
            where: {
                personalNumber: personalNumber,
            },
        });
        if (cekData) {
            const nowYear = nowDate.getFullYear();
            const createdAtYear = cekData.createdAt.getFullYear();
            if (nowYear > createdAtYear) {
                return await this.prisma.point.update({
                    where: {
                        personalNumber: personalNumber,
                    },
                    data: {
                        point: 0,
                        totalPoint: 0,
                    },
                });
            } else {
                return;
            }
        }
        return;
    }
}
