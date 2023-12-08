import { Injectable } from '@nestjs/common';
import { LearningFuseSearch } from '@prisma/clients/nex-learning';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { AppError } from 'src/core/errors/app.error';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { MergeCommunityDTO } from './community-fuse.dto';
import { CommunityFuseServiceInterface } from './community-fuse.services.interface';
import { CommunityFuseSearch } from '@prisma/clients/nex-community';
const Fuse = require('fuse.js');

@Injectable()
export class CommunityFuseService
    extends AppError
    implements CommunityFuseServiceInterface
{
    constructor(private readonly prisma: PrismaCommunityService) {
        super(CommunityFuseService.name);
    }

    async showResultSearch(
        search: string,
        limit: number,
    ): Promise<ResponseDTO<any[]>> {
        const searchArticle = await this.prisma.communities.findMany({
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

        const countArticle = await this.prisma.communities.count({
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

        const searchBestPractice =
            await this.prisma.communityActivities.findMany({
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

        const countBestPractice = await this.prisma.communityActivities.count({
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
                title: article.name,
                description: article.about,
                path: article.headlinedPhotoPath,
                personalNumber: article.personalNumber,
                createdAt: article.createdAt,
            })),
            ...searchBestPractice.map((bestPractice) => ({
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
            total: countArticle + countBestPractice,
        };
        return dataResult;
    }

    async showTrendingSearch(): Promise<LearningFuseSearch[]> {
        return await this.prisma.communityFuseSearch.findMany({
            orderBy: {
                count: 'desc',
            },
            take: 5,
            skip: 0,
        });
    }

    async getSuggestion(search: string): Promise<LearningFuseSearch[]> {
        const allData = await this.prisma.communityFuseSearch.findMany();
        const fuseOptions = {
            threshold: 0.6,
            keys: ['search'],
        };
        const fuse = new Fuse(allData, fuseOptions);
        const searchResults = fuse.search(search);
        const startIndex = (1 - 1) * 5;
        const endIndex = startIndex + 5;

        // Extract the items from the search results, considering pagination
        const suggestions: LearningFuseSearch[] = searchResults
            .slice(startIndex, endIndex)
            .map((result) => result.item);

        return suggestions;
    }

    async createCheck(search: string): Promise<LearningFuseSearch> {
        const checkdata = await this.prisma.communityFuseSearch.findFirst({
            where: {
                search: search.charAt(0).toUpperCase() + search.slice(1),
            },
        });
        const wordsLength = search.split(' ');
        if (wordsLength.length > 1) {
            const words = search.split(/\s+/);
            for (const word of words) {
                const checkWord =
                    await this.prisma.communityFuseSearch.findFirst({
                        where: {
                            search:
                                word.charAt(0).toUpperCase() + word.slice(1),
                        },
                    });
                if (!checkWord) {
                    await this.prisma.communityFuseSearch.create({
                        data: {
                            search:
                                word.charAt(0).toUpperCase() + word.slice(1),
                            count: 0,
                        },
                    });
                }
            }
            if (!checkdata) {
                await this.prisma.communityFuseSearch.create({
                    data: {
                        search: search
                            .split(/\s+/)
                            .map(
                                (wordx) =>
                                    wordx.charAt(0).toUpperCase() +
                                    wordx.slice(1),
                            )
                            .join(' '),
                        count: 0,
                    },
                });
            }
        } else {
            await this.prisma.communityFuseSearch.create({
                data: {
                    search: search.charAt(0).toUpperCase() + search.slice(1),
                    count: 0,
                },
            });
        }
        return;
    }

    async saveSearch(search: string): Promise<LearningFuseSearch> {
        const result = await this.prisma.communityFuseSearch.findFirst({
            where: {
                search: {
                    equals: search
                        .split(/\s+/)
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' '),
                },
            },
        });
        if (result) {
            return await this.prisma.communityFuseSearch.update({
                where: {
                    id: result.id,
                },
                data: {
                    count: result.count + 1,
                },
            });
        }
        return;
    }

    async showResultSearchByInterest(
        search: string[],
    ): Promise<MergeCommunityDTO[]> {
        const data: any[] = [];
        for (const searchTerm of search) {
            const searchArticle = await this.prisma.communities.findMany({
                where: {
                    statusPublish: true,
                    bannedStatus: false,
                    OR: [
                        {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            about: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            location: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            AND: [
                                // { articleCategoryId: articleCategoryId },
                                {
                                    name: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    about: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    location: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
            data.push(
                ...searchArticle.map((article) => ({
                    uuid: article.uuid,
                    title: article.name,
                    description: article.about,
                    path: article.headlinedPhotoPath,
                    personalNumber: article.personalNumber,
                    createdAt: article.createdAt,
                })),
            );
        }

        return data;
    }
}
