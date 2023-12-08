import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { CommunityCommentActivityServicesInterface } from '../interfaces/community-activity-comment.services.interface';
import { CommentActivity } from '@prisma/clients/nex-community';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { ActivityCommentDTO } from '../dto/comment-activity.dto';

@Injectable()
export class CommunityActivityCommentService
    extends AppError
    implements CommunityCommentActivityServicesInterface
{
    constructor(private readonly prisma: PrismaCommunityService) {
        super(CommunityActivityCommentService.name);
    }

    async getCommentActivity(
        activityId: number,
        page: number,
        limit: number,
        sortBy: string,
    ): Promise<ResponseDTO<CommentActivity[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const by_order = [];
        if (sortBy === 'trending') {
            by_order.push({
                like: 'desc',
            });
            by_order.push({
                childComment: {
                    _count: 'desc',
                },
            });
            by_order.push({
                createdAt: 'desc',
            });
        }
        if (sortBy === 'desc') {
            by_order.push({
                createdAt: 'desc',
            });
        }
        const findData = await this.prisma.communityActivities.findFirst({
            where: {
                id: activityId,
            },
        });
        this.handlingErrorNotFound(findData, activityId, 'activity');
        const result = await this.prisma.commentActivity.findMany({
            where: {
                communityActivityId: activityId,
                parentId: null,
            },
            orderBy: by_order,
            take: take,
            skip: skip,
            include: {
                commentLikeActivity: true,
                _count: {
                    select: {
                        childComment: true,
                    },
                },
            },
        });
        this.handlingErrorEmptyData(result, 'Comment');
        const total = await this.prisma.commentActivity.count({
            where: {
                communityActivityId: activityId,
                parentId: null,
            },
        });

        const data: ResponseDTO<CommentActivity[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    async getChildCommentActivity(
        activityId: number,
        parentId: number,
        page: number,
        limit: number,
        sortBy: string,
    ): Promise<ResponseDTO<CommentActivity[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const by_order = [];

        if (sortBy === 'trending') {
            by_order.push({
                like: 'desc',
            });
            by_order.push({
                dislike: 'desc',
            });
            by_order.push({
                createdAt: 'desc',
            });
        }

        if (sortBy == 'recent') {
            by_order.push({
                createdAt: 'desc',
            });
        }
        const result = await this.prisma.commentActivity.findMany({
            where: {
                communityActivityId: activityId,
                parentId: parentId,
            },
            orderBy: [
                {
                    createdAt: 'asc',
                },
            ],
            take: take,
            skip: skip,
            include: {
                commentLikeActivity: true,
                _count: {
                    select: {
                        childComment: true,
                        commentLikeActivity: true,
                    },
                },
            },
        });
        this.handlingErrorEmptyData(result, 'Child Comment');
        const total = await this.prisma.commentActivity.count({
            where: {
                communityActivityId: activityId,
                parentId: parentId,
            },
        });
        const data: ResponseDTO<CommentActivity[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    async createComment(dto: ActivityCommentDTO): Promise<CommentActivity> {
        const findData = await this.prisma.communityActivities.findFirst({
            where: {
                id: dto.activityId,
            },
        });
        this.handlingErrorNotFound(
            findData,
            dto.activityId,
            'Community Activity',
        );
        return await this.prisma.commentActivity.create({
            data: {
                communityActivityId: dto.activityId,
                comment: dto.comment,
                parentId: dto.parentId,
                personalName: dto.personalName,
                personalNumber: dto.personalNumber,
                like: 0,
                dislike: 0,
                personalNameMention: dto.personalNameMention,
                personalNumberMention: dto.personalNumberMention,
            },
        });
    }

    async updateComment(
        uuid: string,
        dto: ActivityCommentDTO,
    ): Promise<CommentActivity> {
        const findData = await this.prisma.commentActivity.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Comment');
        return await this.prisma.commentActivity.update({
            where: {
                uuid: uuid,
            },
            data: {
                comment: dto.comment,
            },
        });
    }

    async deleteCommunity(uuid: string): Promise<CommentActivity> {
        const findData = await this.prisma.commentActivity.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Comment');
        return await this.prisma.commentActivity.delete({
            where: {
                uuid: uuid,
            },
        });
    }
}
