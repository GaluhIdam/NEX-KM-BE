import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { ForYourPageServiceInterface } from '../interfaces/for-your-page-service.interface';
import { ForYourPage } from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { ForYourPageDTO } from '../dto/for-your-page.dto';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Injectable()
export class ForYourPageService
    extends AppError
    implements ForYourPageServiceInterface
{
    constructor(
        private readonly prisma: PrismaHomepageService
        ) {
        super(ForYourPageService.name);
    }

    async getForYourPage(
        page: number,
        limit: number,
        personalNumber: string,
    ): Promise<ResponseDTO<ForYourPage[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const userInterest = await this.prisma.userInterest.findMany({
            where: {
                personalNumber: personalNumber,
            },
            select: {
                interestList: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        const following = await this.prisma.followingFollower.findMany({
            where: {
                personalNumberFollower: personalNumber,
            },
            select: {
                personalNumberFollowing: true,
            },
        });
        const personalNumbers = following.map(
            (item) => item.personalNumberFollowing,
        );
        if (userInterest) {
            const recdata: ForYourPage[] = [];
            let total = 0;
            const uniqueRecords = new Set<string>();
            for (const xdt of userInterest) {
                const result = await this.prisma.forYourPage.findMany({
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: xdt.interestList.name,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: xdt.interestList.name,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalNumber: {
                                    in: personalNumbers,
                                },
                            },
                            {
                                personalNumber: personalNumber,
                            },
                            {
                                AND: [
                                    {
                                        personalNumber: {
                                            in: personalNumbers,
                                        },
                                    },
                                    {
                                        personalNumber: personalNumber,
                                    },
                                    {
                                        title: {
                                            contains: xdt.interestList.name,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        description: {
                                            contains: xdt.interestList.name,
                                            mode: 'insensitive',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    take: take,
                    skip: skip,
                });
                const count = await this.prisma.forYourPage.count({
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: xdt.interestList.name,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: xdt.interestList.name,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalNumber: {
                                    in: personalNumbers,
                                },
                            },
                            {
                                personalNumber: personalNumber,
                            },
                            {
                                AND: [
                                    {
                                        personalNumber: {
                                            in: personalNumbers,
                                        },
                                    },
                                    {
                                        personalNumber: personalNumber,
                                    },
                                    {
                                        title: {
                                            contains: xdt.interestList.name,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        description: {
                                            contains: xdt.interestList.name,
                                            mode: 'insensitive',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                });
                result.forEach((record) => {
                    const recordKey = `${record.title}-${record.description}-${record.personalNumber}`;
                    if (!uniqueRecords.has(recordKey)) {
                        uniqueRecords.add(recordKey);
                        recdata.push(record);
                    }
                });
                total = count;
            }
            recdata.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
            );
            const data: ResponseDTO<ForYourPage[]> = {
                result: recdata,
                total: total,
            };
            return data;
        } else {
            const result = await this.prisma.forYourPage.findMany({
                where: {
                    OR: [
                        {
                            personalNumber: {
                                in: personalNumbers,
                            },
                        },
                        {
                            personalNumber: personalNumber,
                        },
                        {
                            AND: [
                                {
                                    personalNumber: {
                                        in: personalNumbers,
                                    },
                                },
                                {
                                    personalNumber: personalNumber,
                                },
                            ],
                        },
                    ],
                },
                take: take,
                skip: skip,
            });
            const count = await this.prisma.forYourPage.count({
                where: {
                    OR: [
                        {
                            personalNumber: {
                                in: personalNumbers,
                            },
                        },
                        {
                            personalNumber: personalNumber,
                        },
                        {
                            AND: [
                                {
                                    personalNumber: {
                                        in: personalNumbers,
                                    },
                                },
                                {
                                    personalNumber: personalNumber,
                                },
                            ],
                        },
                    ],
                },
            });
            const data: ResponseDTO<ForYourPage[]> = {
                result: result,
                total: count,
            };
            return data;
        }
    }

    async createForYourPage(dto: ForYourPageDTO): Promise<ForYourPage> {
        return await this.prisma.forYourPage.create({
            data: {
                ...dto,
            },
        });
    }

    async deleteForYourPage(uuid: string): Promise<ForYourPage> {
        const findData = await this.prisma.forYourPage.findFirst({
            where: { uuid: uuid },
        });
        if (findData) {
            return await this.prisma.forYourPage.delete({
                where: {
                    uuid,
                },
            });
        }
        return findData;
    }
}
