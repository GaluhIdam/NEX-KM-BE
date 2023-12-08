import { CommentLikeActivity } from '@prisma/clients/nex-community';
import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { CommunityActivityLikeServiceInterface } from '../interfaces/community-activity-like.service.interface';
import { ActivityCommentLikeDTO } from '../dtos/community-activity.dto';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';

@Injectable()
export class CommunityActivityLikeService
    extends AppError
    implements CommunityActivityLikeServiceInterface
{
    constructor(private readonly prisma: PrismaCommunityService) {
        super(CommunityActivityLikeService.name);
    }

    async likeDislikeComment(
        activityId: number,
        commentActivityId: number,
        personalNumber: string,
        dto: ActivityCommentLikeDTO,
    ): Promise<CommentLikeActivity> {
        const findData = await this.prisma.commentLikeActivity.findFirst({
            where: {
                activityId: Number(activityId),
                commentActivityId: Number(commentActivityId),
                personalNumber: personalNumber,
            },
        });

        if (findData) {
            const total = await this.prisma.commentActivity.findFirst({
                where: {
                    id: Number(commentActivityId),
                },
            });
            if (findData.likeOrdislike == dto.likeOrdislike) {
                if (findData.likeOrdislike == true) {
                    await this.prisma.commentActivity.update({
                        where: {
                            id: Number(commentActivityId),
                        },
                        data: {
                            like: total.like - 1,
                            // dislike: total.dislike - 1
                        },
                    });
                    return await this.prisma.commentLikeActivity.delete({
                        where: {
                            id: findData.id,
                        },
                    });
                }
                if (findData.likeOrdislike == false) {
                    await this.prisma.commentActivity.update({
                        where: {
                            id: Number(commentActivityId),
                        },
                        data: {
                            // like: total.like - 1,
                            dislike: total.dislike - 1,
                        },
                    });
                    return await this.prisma.commentLikeActivity.delete({
                        where: {
                            id: findData.id,
                        },
                    });
                }
            }
            if (findData.likeOrdislike != dto.likeOrdislike) {
                if (dto.likeOrdislike == true) {
                    await this.prisma.commentActivity.update({
                        where: {
                            id: Number(commentActivityId),
                        },
                        data: {
                            like: total.like + 1,
                            dislike: total.dislike - 1,
                        },
                    });
                    return await this.prisma.commentLikeActivity.update({
                        where: {
                            id: findData.id,
                        },
                        data: {
                            ...dto,
                        },
                    });
                }
                if (dto.likeOrdislike == false) {
                    await this.prisma.commentActivity.update({
                        where: {
                            id: Number(commentActivityId),
                        },
                        data: {
                            like: total.like - 1,
                            dislike: total.dislike + 1,
                        },
                    });
                    return await this.prisma.commentLikeActivity.update({
                        where: {
                            id: findData.id,
                        },
                        data: {
                            ...dto,
                        },
                    });
                }
            }
        }

        if (!findData) {
            const total = await this.prisma.commentActivity.findFirst({
                where: {
                    id: Number(commentActivityId),
                },
            });
            if (dto.likeOrdislike == true) {
                await this.prisma.commentActivity.update({
                    where: {
                        id: Number(commentActivityId),
                    },
                    data: {
                        like: total.like + 1,
                        // dislike: total.dislike - 1
                    },
                });
                return await this.prisma.commentLikeActivity.create({
                    data: {
                        ...dto,
                    },
                });
            }
            if (dto.likeOrdislike == false) {
                await this.prisma.commentActivity.update({
                    where: {
                        id: Number(commentActivityId),
                    },
                    data: {
                        // like: total.like - 1,
                        dislike: total.dislike + 1,
                    },
                });
                return await this.prisma.commentLikeActivity.create({
                    data: {
                        ...dto,
                    },
                });
            }
        }
    }
}
