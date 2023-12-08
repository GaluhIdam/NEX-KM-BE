import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { CommunityActivityLikeControllerInterface } from '../interfaces/community-activity-like.controller.interface';
import { ActivityCommentLikeDTO } from '../dtos/community-activity.dto';
import { CommunityActivityLikeService } from '../services/community-activity-like.service';
import { Response } from 'express';

@Controller({ path: 'api/community-activity-like', version: '1' })
export class CommunityActivityLikeController
    extends BaseController
    implements CommunityActivityLikeControllerInterface
{
    constructor(
        private readonly communityCommentLikeService: CommunityActivityLikeService,
    ) {
        super(CommunityActivityLikeController.name);
    }

    @Post()
    async likeDislikeComment(
        @Res() res: Response<any, Record<string, any>>,
        @Query('activityId') activityId: number,
        @Query('commentActivityId') commentActivityId: number,
        @Query('personalNumber') personalNumber: string,
        @Body() dto: ActivityCommentLikeDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.communityCommentLikeService.likeDislikeComment(
                    activityId,
                    commentActivityId,
                    personalNumber,
                    dto,
                );
            return res
                .status(201)
                .send(this.responseMessage('like', 'check', 201, result));
        } catch (error) {
            throw error;
        }
    }
}
