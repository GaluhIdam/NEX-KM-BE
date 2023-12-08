import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { CommentForumLike } from '@prisma/clients/nex-talk';
import { ForumCommentLikeDTO } from '../dtos/forum-comment-like.dto';
import { ForumCommentLikeServiceInterface } from '../interfaces/forum-comment-like.service.interface';

@Injectable()
export class ForumCommentLikeService
    extends AppError
    implements ForumCommentLikeServiceInterface
{
    constructor(private readonly prisma: PrismaTalkService) {
        super(ForumCommentLikeService.name);
    }

    //Get Forum Comment Like
    async getForumCommentLike(
        commentForumId: number,
    ): Promise<CommentForumLike[]> {
        const findForumComment = await this.prisma.commentForum.findFirst({
            where: {
                id: commentForumId,
            },
        });
        this.handlingErrorNotFound(
            findForumComment,
            commentForumId,
            'Forum Comment',
        );

        const result = await this.prisma.commentForumLike.findMany({
            where: {
                commentForumId: commentForumId,
            },
        });

        this.handlingErrorEmptyData(result, 'Forum Comment Like');
        return result;
    }

    // Check & Create & Update & Delete
    async bulkUpdateForumCommentLike(
        dto: ForumCommentLikeDTO,
    ): Promise<CommentForumLike> {
        const forumCommentData = await this.prisma.commentForum.findFirst({
            where: {
                id: dto.commentForumId,
            },
        });
        this.handlingErrorNotFound(
            forumCommentData,
            dto.commentForumId,
            'Comment Forum',
        );

        const forumCommentLikeData =
            await this.prisma.commentForumLike.findFirst({
                where: {
                    commentForumId: dto.commentForumId,
                    personalNumber: dto.personalNumber,
                },
            });

        if (forumCommentLikeData === null) {
            // Create
            const commentLike: CommentForumLike =
                await this.prisma.commentForumLike.create({
                    data: {
                        forumId: dto.forumId,
                        commentForumId: dto.commentForumId,
                        personalNumber: dto.personalNumber,
                        likeOrdislike: dto.likeOrdislike,
                    },
                });

            return commentLike;
        } else {
            if (forumCommentLikeData.likeOrdislike === dto.likeOrdislike) {
                // Delete
                const commentLike: CommentForumLike =
                    await this.prisma.commentForumLike.delete({
                        where: {
                            uuid: forumCommentLikeData.uuid,
                        },
                    });

                return commentLike;
            } else {
                // Update
                const commentLike: CommentForumLike =
                    await this.prisma.commentForumLike.update({
                        where: {
                            uuid: forumCommentLikeData.uuid,
                        },
                        data: {
                            likeOrdislike: dto.likeOrdislike,
                        },
                    });

                return commentLike;
            }
        }
    }
}
