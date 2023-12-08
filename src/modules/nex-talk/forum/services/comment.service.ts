import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { CommentServiceInterface } from '../interfaces/comment.service.inteface';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { CommentForum } from '@prisma/clients/nex-talk';
import { ForumCommentDTO } from '../dtos/forum-comment.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
import { ForumCommentChildShowDTO } from '../dtos/forum-comment-child-show.dto';

@Injectable()
export class CommentService
    extends AppError
    implements CommentServiceInterface
{
    constructor(private readonly prisma: PrismaTalkService) {
        super(CommentService.name);
    }

    //Get Comment
    async getCommentByForum(
        page: number,
        limit: number,
        id_forum?: number,
        order_by?: string,
        parent_id?: string,
    ): Promise<PaginationDTO<CommentForum[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const by_order = [];
        if (order_by == 'desc' || order_by == 'asc') {
            by_order.push({
                createdAt: order_by,
            });
        }

        if (order_by === 'top') {
            by_order.push({
                likeComment: {
                    _count: 'desc',
                },
            });
            by_order.push({
                childComment: {
                    _count: 'desc',
                },
            });
            by_order.push({
                updatedAt: 'desc',
            });
        }

        if (order_by === 'recent') {
            by_order.push({
                updatedAt: 'desc',
            });
        }

        let where = {};

        const filters = [];

        if (id_forum) {
            const findForumData = await this.prisma.forum.findFirst({
                where: {
                    id: Number(id_forum),
                },
            });
            this.handlingErrorNotFound(findForumData, id_forum, 'Forum');

            filters.push({
                forumId: Number(id_forum),
            });
        }

        if (parent_id) {
            filters.push({ parentId: Number(parent_id) });
        } else {
            filters.push({ parentId: null });
        }

        if (filters.length > 0) {
            where = { AND: filters };
        }

        const result = await this.prisma.commentForum.findMany({
            where: where,
            take: take,
            skip: skip,
            orderBy: by_order,
            include: {
                childComment: {
                    include: {
                        childComment: {
                            include: {
                                childComment: true,
                                likeComment: true,
                            },
                        },
                        likeComment: true,
                    },
                },
                likeComment: true,
            },
        });

        const totalItems = await this.prisma.commentForum.count({ where });
        const totalPages = Math.ceil(totalItems / take);

        const response: PaginationDTO<CommentForum[]> = {
            page: Number(page),
            limit: take,
            totalItems: totalItems,
            totalPages: totalPages,
            data: result,
        };

        this.handlingErrorEmptyDataPagination(response, 'Comment');
        return response;
    }

    //Create Comment
    async createComment(dto: ForumCommentDTO): Promise<CommentForum> {
        const findData = await this.prisma.forum.findFirst({
            where: {
                id: dto.forumId,
            },
        });
        this.handlingErrorNotFound(findData, dto.forumId, 'Forum');

        if (dto.parentId !== null) {
            const parentComment = await this.prisma.commentForum.findFirst({
                where: {
                    id: dto.parentId,
                },
            });

            this.handlingErrorNotFound(
                parentComment,
                dto.parentId,
                'Forum Parent Comment',
            );

            await this.prisma.commentForum.update({
                where: {
                    uuid: parentComment.uuid,
                },
                data: {
                    isChildCommentShow: true,
                },
            });
        }

        return this.prisma.commentForum.create({
            data: {
                comment: dto.comment,
                personalNumber: dto.personalNumber,
                forumId: dto.forumId,
                parentId: dto.parentId,
                createdBy: dto.createdBy,
                isChildCommentShow: false,
            },
        });
    }

    //Update Comment
    async updateComment(
        uuid: string,
        dto: ForumCommentDTO,
    ): Promise<CommentForum> {
        const findData = await this.prisma.commentForum.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Comment');
        const findData2 = await this.prisma.forum.findFirst({
            where: {
                id: dto.forumId,
            },
        });
        this.handlingErrorNotFound(findData2, dto.forumId, 'Forum');
        return await this.prisma.commentForum.update({
            where: {
                uuid: uuid,
            },
            data: {
                personalNumber: dto.personalNumber,
                createdBy: dto.createdBy,
                comment: dto.comment,
            },
        });
    }

    //Delete Comment
    async deleteComment(uuid: string): Promise<CommentForum> {
        const comment = await this.prisma.commentForum.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(comment, uuid, 'Comment');

        if (comment.parentId !== null) {
            const parentComment = await this.prisma.commentForum.findFirst({
                where: {
                    id: comment.parentId,
                },
                include: {
                    childComment: true,
                },
            });

            this.handlingErrorNotFound(
                parentComment,
                comment.parentId,
                'Forum Parent Comment',
            );

            if (parentComment.childComment.length === 1) {
                await this.prisma.commentForum.update({
                    where: {
                        uuid: parentComment.uuid,
                    },
                    data: {
                        isChildCommentShow: false,
                    },
                });
            }
        }

        const childComment = await this.prisma.commentForum.findMany({
            where: {
                parentId: comment.id,
            },
        });
        if (childComment.length > 0) {
            await this.prisma.commentForum.deleteMany({
                where: {
                    parentId: comment.id,
                },
            });
        }

        return await this.prisma.commentForum.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    //Update Child Comment Show
    async updateForumCommentChildShow(
        uuid: string,
        dto: ForumCommentChildShowDTO,
    ): Promise<CommentForum> {
        const findData = await this.prisma.commentForum.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                childComment: true,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Forum Comment');
        return await this.prisma.commentForum.update({
            where: {
                uuid: uuid,
            },
            data: {
                isChildCommentShow: dto.isChildCommentShow,
            },
        });
    }
}
