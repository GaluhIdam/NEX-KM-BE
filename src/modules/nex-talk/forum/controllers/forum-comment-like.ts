import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { Response } from 'express';

import { ForumCommentLikeService } from '../services/forum-comment-like.service';
import { ForumCommentLikeDTO } from '../dtos/forum-comment-like.dto';
import { ForumCommentLikeControllerInterface } from '../interfaces/forum-comment-like.controller.interface';

@Controller({ path: 'api/forum-comment/like', version: '1' })
export class ForumCommentLikeController
    extends BaseController
    implements ForumCommentLikeControllerInterface
{
    constructor(private readonly forumCommentLike: ForumCommentLikeService) {
        super(ForumCommentLikeController.name);
    }

    //Get All Comment Like by Comment Forum ID
    @Get('/:comment_forum_id')
    async getForumCommentLike(
        @Res() res: Response<any, Record<string, any>>,
        @Param('comment_forum_id') commentForumId: number,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const commentLikes =
                await this.forumCommentLike.getForumCommentLike(commentForumId);
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Forum Comment Like',
                        'Get',
                        201,
                        commentLikes,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Check & Create & Update & Delete
    @Post('/updates')
    async updateForumCommentLike(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: ForumCommentLikeDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            await this.errorsValidation(ForumCommentLikeDTO, dto);
            const result =
                await this.forumCommentLike.bulkUpdateForumCommentLike(dto);
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Forum Comment Like',
                        'Bulk Update',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }
}
