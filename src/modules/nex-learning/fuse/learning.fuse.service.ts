import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { LearningFuseServiceInterface } from './learning.fuse.service.interface';
import { LearningFuseSearch } from '@prisma/clients/nex-learning';
import { AppError } from 'src/core/errors/app.error';
import { Injectable } from '@nestjs/common';
import { MergeLearningDTO } from './fuse.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
const Fuse = require('fuse.js');

@Injectable()
export class LearningFuseService
    extends AppError
    implements LearningFuseServiceInterface
{
    constructor(private readonly prisma: PrismaLearningService) {
        super(LearningFuseService.name);
    }

    async showResultSearch(
        search: string,
        page: number,
        limit: number,
    ): Promise<ResponseDTO<any[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        await this.saveSearch(search);
        const searchArticle = await this.prisma.article.findMany({
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
                            title: { contains: search, mode: 'insensitive' },
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

        const countArticle = await this.prisma.article.count({
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
                            title: { contains: search, mode: 'insensitive' },
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

        const searchBestPractice = await this.prisma.bestPractice.findMany({
            where: {
                approvalStatus: true,
                bannedStatus: false,
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { unit: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            { unit: { contains: search, mode: 'insensitive' } },
                        ],
                    },
                ],
            },
            take: take,
            skip: skip,
        });

        const countBestPractice = await this.prisma.bestPractice.count({
            where: {
                approvalStatus: true,
                bannedStatus: false,
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { unit: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            { unit: { contains: search, mode: 'insensitive' } },
                        ],
                    },
                ],
            },
        });

        const searchStory = await this.prisma.story.findMany({
            where: {
                approvalStatus: true,
                bannedStatus: false,
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { unit: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            { unit: { contains: search, mode: 'insensitive' } },
                        ],
                    },
                ],
            },
            take: take,
            skip: skip,
        });

        const countStory = await this.prisma.story.count({
            where: {
                approvalStatus: true,
                bannedStatus: false,
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { unit: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            { unit: { contains: search, mode: 'insensitive' } },
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
        ];
        const dataResult: ResponseDTO<any[]> = {
            result: data
                .sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return Number(dateB) - Number(dateA);
                })
                .splice(0, limit - 1),
            total: countArticle + countBestPractice + countStory,
        };
        return dataResult;
    }

    async showTrendingSearch(): Promise<LearningFuseSearch[]> {
        return await this.prisma.learningFuseSearch.findMany({
            orderBy: {
                count: 'desc',
            },
            take: 5,
            skip: 0,
        });
    }

    async createCheck(search: string): Promise<LearningFuseSearch> {
        const checkdata = await this.prisma.learningFuseSearch.findFirst({
            where: {
                search: search.charAt(0).toUpperCase() + search.slice(1),
            },
        });
        const wordsLength = search.split(' ');
        if (wordsLength.length > 1) {
            const words = search.split(/\s+/);
            for (const word of words) {
                const checkWord =
                    await this.prisma.learningFuseSearch.findFirst({
                        where: {
                            search:
                                word.charAt(0).toUpperCase() + word.slice(1),
                        },
                    });
                if (!checkWord) {
                    await this.prisma.learningFuseSearch.create({
                        data: {
                            search:
                                word.charAt(0).toUpperCase() + word.slice(1),
                            count: 0,
                        },
                    });
                }
            }
            if (!checkdata) {
                await this.prisma.learningFuseSearch.create({
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
            await this.prisma.learningFuseSearch.create({
                data: {
                    search: search.charAt(0).toUpperCase() + search.slice(1),
                    count: 0,
                },
            });
        }
        return;
    }

    async getSuggestion(search: string): Promise<LearningFuseSearch[]> {
        const allData = await this.prisma.learningFuseSearch.findMany();
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

    async saveSearch(search: string): Promise<LearningFuseSearch> {
        const result = await this.prisma.learningFuseSearch.findFirst({
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
            return await this.prisma.learningFuseSearch.update({
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
    ): Promise<MergeLearningDTO[]> {
        const data: any[] = [];
        for (const searchTerm of search) {
            const searchArticle = await this.prisma.article.findMany({
                where: {
                    approvalStatus: true,
                    bannedStatus: false,
                    OR: [
                        {
                            title: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            unit: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            uploadBy: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            approvalBy: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            approvalDesc: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            AND: [
                                // { articleCategoryId: articleCategoryId },
                                {
                                    title: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    unit: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    uploadBy: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalBy: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalDesc: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    ],
                },
                take: 5,
                skip: 0,
            });

            const searchBestPractice = await this.prisma.bestPractice.findMany({
                where: {
                    approvalStatus: true,
                    bannedStatus: false,
                    OR: [
                        {
                            title: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            unit: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            uploadBy: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            approvalDesc: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            approvalBy: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            AND: [
                                {
                                    title: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    unit: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    uploadBy: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalDesc: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    approvalBy: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    ],
                },
                take: 10,
                skip: 0,
            });

            data.push(
                ...searchArticle.map((article) => ({
                    uuid: article.uuid,
                    title: article.title,
                    description: article.content,
                    path: article.path,
                    unit: article.unit,
                    personalNumber: article.personalNumber,
                })),
                ...searchBestPractice.map((bestPractice) => ({
                    uuid: bestPractice.uuid,
                    title: bestPractice.title,
                    description: bestPractice.content,
                    path: bestPractice.path,
                    unit: bestPractice.unit,
                    personalNumber: bestPractice.personalNumber,
                })),
            );
        }

        return data;
    }
}
