import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    Res,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { ArticleCommentLikeControllerInterface } from '../interfaces/article-comment-like.controller.interface';
import { ArticleCommentLikeService } from '../services/article-comment-like.service';
import { ArticleCommentLikeDTO } from '../dtos/article-comment-like.dto';
import { Response } from 'express';

@Controller({ path: 'api/article-comment-like', version: '1' })
export class ArticleCommentLikeController
    extends BaseController
    implements ArticleCommentLikeControllerInterface
{
    constructor(
        private readonly articleCommentLikeService: ArticleCommentLikeService,
    ) {
        super(ArticleCommentLikeController.name);
    }

    @Post()
    async likeDislikeComment(
        @Res() res: Response<any, Record<string, any>>,
        @Query('articleId') articleId: number,
        @Query('commentArticleId') commentArticleId: number,
        @Query('personalNumber') personalNumber: string,
        @Body() dto: ArticleCommentLikeDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.articleCommentLikeService.likeDislikeComment(
                    articleId,
                    commentArticleId,
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
