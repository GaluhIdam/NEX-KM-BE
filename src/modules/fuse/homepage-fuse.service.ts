import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { HomepageFuseServiceInterface } from './homepage-fuse.service.interface';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { ResponseDTO } from 'src/core/dtos/response.dto';

@Injectable()
export class HomepageFuseService
    extends AppError
    implements HomepageFuseServiceInterface
{
    constructor(
        private readonly prismaCommunity: PrismaCommunityService,
        private readonly prismaLearning: PrismaLearningService,
    ) {
        super(HomepageFuseService.name);
    }

    async showResult(
        search: string,
        page: number,
        limit: number,
    ): Promise<ResponseDTO<any[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const searchArticle = await this.prismaLearning.article.findMany({
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
                    {
                        articleCategory: {
                            title: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        content: {
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
                                articleCategory: {
                                    title: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                content: {
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
            take: take,
            skip: skip,
        });

        const countArticle = await this.prismaLearning.article.count({
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
                    {
                        articleCategory: {
                            title: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        content: {
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
                                articleCategory: {
                                    title: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                content: {
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
        });

        const searchBestPractice =
            await this.prismaLearning.bestPractice.findMany({
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
                        {
                            unit: {
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
                            ],
                        },
                    ],
                },
                take: take,
                skip: skip,
            });

        const countBestPractice = await this.prismaLearning.bestPractice.count({
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
        });

        const searchStory = await this.prismaLearning.story.findMany({
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
            take: take,
            skip: skip,
        });

        const countStory = await this.prismaLearning.story.count({
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
        });

        const searchCommunity = await this.prismaCommunity.communities.findMany(
            {
                where: {
                    statusPublish: true,
                    bannedStatus: false,
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            about: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        { location: { contains: search, mode: 'insensitive' } },
                        {
                            AND: [
                                // { articleCategoryId: articleCategoryId },
                                {
                                    name: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    about: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    location: {
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
            },
        );

        const countCommunity = await this.prismaCommunity.communities.count({
            where: {
                statusPublish: true,
                bannedStatus: false,
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        about: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    { location: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            // { articleCategoryId: articleCategoryId },
                            {
                                name: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                about: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                location: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
        });

        const searchActivity =
            await this.prismaCommunity.communityActivities.findMany({
                where: {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        {
                            description: {
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
                                    description: {
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
            });

        const countActivity =
            await this.prismaCommunity.communityActivities.count({
                where: {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        {
                            description: {
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

        const data: any[] = [
            ...searchArticle.map((article) => ({
                uuid: article.uuid,
                title: article.title,
                description: article.content,
                path: article.path,
                unit: article.unit,
                personalNumber: article.personalNumber,
                createdAt: article.createdAt,
            })),
            ...searchBestPractice.map((bestPractice) => ({
                uuid: bestPractice.uuid,
                title: bestPractice.title,
                description: bestPractice.content,
                path: bestPractice.path,
                unit: bestPractice.unit,
                personalNumber: bestPractice.personalNumber,
                createdAt: bestPractice.createdAt,
            })),
            ...searchStory.map((story) => ({
                uuid: story.uuid,
                title: story.title,
                description: story.description,
                path: story.cover,
                unit: story.unit,
                personalNumber: story.personalNumber,
                createdAt: story.createdAt,
            })),
            ...searchCommunity.map((article) => ({
                uuid: article.uuid,
                title: article.name,
                description: article.about,
                path: article.headlinedPhotoPath,
                personalNumber: article.personalNumber,
                createdAt: article.createdAt,
            })),
            ...searchActivity.map((bestPractice) => ({
                uuid: bestPractice.uuid,
                title: bestPractice.title,
                description: bestPractice.description,
                path: bestPractice.path,
                personalNumber: bestPractice.personalNumber,
                createdAt: bestPractice.createdAt,
            })),
        ];
        const dataResult: ResponseDTO<any[]> = {
            result: data
                .sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return Number(dateB) - Number(dateA);
                })
                .splice(0, limit - 1),
            total:
                countCommunity +
                countActivity +
                countArticle +
                countBestPractice +
                countStory,
        };
        return dataResult;
    }
}
