import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { Forum } from '@prisma/clients/nex-talk';
import { ForumDTO } from '../dtos/forum.dto';
import { ForumServiceInterface } from '../interfaces/forum.service.interface';
import { unlinkSync } from 'fs';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
import { ForumStatusApprovalDTO } from '../dtos/forum-status-approval.dto';
import { ForumEditorChoiceDTO } from '../dtos/forum-editor-choice.dto';
import { ForumStatusDTO } from '../dtos/forum-status.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';
import calculateStatisticPercentage from 'src/core/utility/statistic-percentage-util';
import { ForumsearchService } from './forum-search.service';

@Injectable()
export class ForumService extends AppError implements ForumServiceInterface {
    constructor(
        private readonly prisma: PrismaTalkService,
        private forumSearch: ForumsearchService,
    ) {
        super(ForumService.name);
    }

    async search(query: string): Promise<Record<string, any>> {
        return await this.forumSearch.search(query);
    }

    //Get Forum
    async getForum(
        page: number,
        limit: number,
        id_forum_category?: number,
        search?: string,
        order_by?: string,
        status?: boolean,
        approval_status?: string,
    ): Promise<PaginationDTO<Forum[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const by_order = {};
        if (order_by == 'desc' || order_by == 'asc') {
            by_order['createdAt'] = order_by;
        } else if (order_by == 'forumComment') {
            by_order['forumComment'] = {
                _count: 'desc',
            };
        }

        let where = {};

        const filters = [];

        if (status !== null) {
            filters.push({ status: status });
        }

        if (approval_status) {
            filters.push({ approvalStatus: approval_status });
        }

        if (id_forum_category) {
            filters.push(
                id_forum_category == null || ''
                    ? {}
                    : { talkCategoryId: Number(id_forum_category) },
            );
        }

        if (search) {
            filters.push({
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
            });
        }

        if (filters.length > 0) {
            where = { AND: filters };
        }

        const result = await this.prisma.forum.findMany({
            where: where,
            take: take,
            skip: skip,
            orderBy: by_order,
            include: {
                talkCategory: true,
                forumComment: true,
                forumVote: true,
            },
        });

        const totalItems = result.length;
        const totalPages = Math.ceil(totalItems / take);

        const response: PaginationDTO<Forum[]> = {
            page: Number(page),
            limit: take,
            totalItems: totalItems,
            totalPages: totalPages,
            data: result,
        };

        this.handlingErrorEmptyDataPagination(response, 'Forum');
        return response;
    }

    //Get Forum Statistic
    async getForumStatistic(): Promise<StatisticDTO> {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const firstDayOfBeforeMonth = new Date(
            currentYear,
            currentMonth - 2,
            1,
        );
        const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const firstDayOfNextMonth = new Date(currentYear, currentMonth, 1);

        const allForums = await this.getAllForums();
        const needApprovalForums = await this.getForumsByApprovalStatus(
            'Waiting Approval',
        );
        const publishedForums = await this.getForumsByApprovalStatus(
            'Approved',
        );
        const currentMonthForums = await this.getForumsByCreatedAtRange(
            firstDayOfMonth,
            firstDayOfNextMonth,
        );
        const beforeMonthForums = await this.getForumsByCreatedAtRange(
            firstDayOfBeforeMonth,
            firstDayOfMonth,
        );

        const isCurrentMonthGreaterThanBeforeMonth =
            currentMonthForums.length >= beforeMonthForums.length;

        const response: StatisticDTO = {
            totalAllCreations: allForums.length,
            totalCreationCurrentMonth: currentMonthForums.length,
            totalCreationBeforeMonth: beforeMonthForums.length,
            totalCreationPublished: publishedForums.length,
            totalCreationNeedApproval: needApprovalForums.length,
            isCurrentMonthGreaterThanBeforeMonth:
                isCurrentMonthGreaterThanBeforeMonth,
            totalCurrentMonthPersentage: calculateStatisticPercentage(
                isCurrentMonthGreaterThanBeforeMonth,
                currentMonthForums.length,
                beforeMonthForums.length,
            ),
        };

        return response;
    }

    //Get Forum By Id
    async getForumById(uuid: string): Promise<Forum> {
        const result = await this.prisma.forum.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                talkCategory: true,
                forumComment: true,
                forumVote: true,
            },
        });
        this.handlingErrorNotFound(result, uuid, 'Forum');
        return result;
    }

    //Create Forum
    async createForum(dto: ForumDTO): Promise<Forum> {
        try {
            const findData = await this.prisma.talkCategory.findFirst({
                where: {
                    id: dto.talkCategoryId,
                },
            });
            this.handlingErrorNotFound(
                findData,
                dto.talkCategoryId,
                'Talk Category',
            );
        } catch (error) {
            if (dto.path !== '-') {
                unlinkSync(`./uploads/${dto.path}`);
            }
            throw error;
        }

        const forum: Forum = await this.prisma.forum.create({
            data: {
                title: dto.title,
                description: dto.description,
                talkCategoryId: dto.talkCategoryId,
                personalNumber: dto.personalNumber,
                name: dto.name,
                path: dto.path,
                createdBy: dto.createdBy,
                unit: dto.unit,
                status: true,
                voteCount: 0,
                likeCount: 0,
                editorChoice: false,
                approvalStatus: 'Approved',
                approvalMessage: '',
                approvalBy: '',
            },
            include: {
                talkCategory: true,
                forumComment: true,
                forumVote: true,
            },
        });

        this.forumSearch.indexForum(forum);
        return forum;
    }

    //Update Forum
    async updateForum(uuid: string, dto: ForumDTO): Promise<Forum> {
        try {
            const findData = await this.prisma.forum.findFirst({
                where: {
                    uuid: uuid,
                },
            });
            this.handlingErrorNotFound(findData, uuid, 'Forum');
            const findData2 = await this.prisma.talkCategory.findFirst({
                where: {
                    id: dto.talkCategoryId,
                },
            });
            this.handlingErrorNotFound(
                findData2,
                dto.talkCategoryId,
                'Talk Category',
            );
            if (findData.path !== '-') {
                unlinkSync(`./uploads/${findData.path}`);
            }
        } catch (error) {
            if (dto.path !== '-') {
                unlinkSync(`./uploads/${dto.path}`);
            }
            throw error;
        }

        const forum: Forum = await this.prisma.forum.update({
            where: {
                uuid: uuid,
            },
            data: {
                title: dto.title,
                description: dto.description,
                talkCategoryId: dto.talkCategoryId,
                personalNumber: dto.personalNumber,
                name: dto.name,
                path: dto.path,
            },
            include: {
                talkCategory: true,
                forumComment: true,
            },
        });

        await this.forumSearch.update(forum);
        return forum;
    }

    //Delete Forum
    async deleteForum(uuid: string): Promise<Forum> {
        const findData = await this.prisma.forum.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Forum');

        if (findData.path !== '-') {
            unlinkSync(`./uploads/${findData.path}`);
        }

        const forum: Forum = await this.prisma.forum.delete({
            where: {
                uuid: uuid,
            },
            include: {
                talkCategory: true,
                forumComment: true,
            },
        });

        await this.forumSearch.remove(uuid);
        return forum;
    }

    //Update Status Forum
    async updateForumStatus(uuid: string, dto: ForumStatusDTO): Promise<Forum> {
        const findData = await this.prisma.forum.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Forum');
        const forum: Forum = await this.prisma.forum.update({
            where: {
                uuid: uuid,
            },
            data: {
                status: dto.status,
            },
        });

        await this.forumSearch.update(forum);
        return forum;
    }

    //Update Ebook Status Approval
    async updateForumStatusApproval(
        uuid: string,
        dto: ForumStatusApprovalDTO,
    ): Promise<Forum> {
        const findData = await this.prisma.forum.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Forum');
        const forum: Forum = await this.prisma.forum.update({
            where: {
                uuid: uuid,
            },
            data: {
                approvalStatus: dto.approvalStatus,
                approvalMessage: dto.approvalMessage ?? '',
                approvalBy: dto.approvalBy,
            },
        });

        await this.forumSearch.update(forum);
        return forum;
    }

    //Update Editor Choice Forum
    async updateForumEditorChoice(
        uuid: string,
        dto: ForumEditorChoiceDTO,
    ): Promise<Forum> {
        const findData = await this.prisma.forum.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Forum');
        const forum: Forum = await this.prisma.forum.update({
            where: {
                uuid: uuid,
            },
            data: {
                editorChoice: dto.editorChoice,
            },
        });

        await this.forumSearch.update(forum);
        return forum;
    }

    private async getAllForums(): Promise<Forum[]> {
        return this.prisma.forum.findMany();
    }

    private async getForumsByApprovalStatus(
        approvalStatus: string,
    ): Promise<Forum[]> {
        return this.prisma.forum.findMany({
            where: {
                approvalStatus,
            },
        });
    }

    private async getForumsByCreatedAtRange(
        startDate: Date,
        endDate: Date,
    ): Promise<Forum[]> {
        return this.prisma.forum.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
        });
    }
}
