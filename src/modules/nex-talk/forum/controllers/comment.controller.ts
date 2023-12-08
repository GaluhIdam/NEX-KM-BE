import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Res,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { CommentControllerInterface } from '../interfaces/comment.controller.interface';
import { CommentService } from '../services/comment.service';
import { Response } from 'express';
import { ForumCommentDTO } from '../dtos/forum-comment.dto';
import { ForumCommentChildShowDTO } from '../dtos/forum-comment-child-show.dto';

@Controller({ path: 'api/forum-comment', version: '1' })
export class CommentController
    extends BaseController
    implements CommentControllerInterface
{
    constructor(private readonly commentService: CommentService) {
        super(CommentController.name);
    }

    //Get Comment
    @Get()
    async getComment(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('id_forum') id_forum?: number,
        @Query('order_by') order_by?: string,
        @Query('parent_id') parent_id?: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            const result = await this.commentService.getCommentByForum(
                page,
                limit,
                id_forum,
                order_by,
                parent_id,
            );
            return res
                .status(200)
                .send(this.responseMessage('comment', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Post()
    async createComment(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: ForumCommentDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.errorsValidation(ForumCommentDTO, dto);
            const result = await this.commentService.createComment(dto);
            return res
                .status(201)
                .send(this.responseMessage('comment', 'Create', 201, result));
        } catch (error) {
            throw error;
        }
    }

    @Put('/:uuid')
    async updateComment(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: ForumCommentDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            this.errorsValidation(ForumCommentDTO, dto);
            const result = await this.commentService.updateComment(uuid, dto);
            return res
                .status(200)
                .send(this.responseMessage('comment', 'Update', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Delete('/:uuid')
    async deleteComment(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.commentService.deleteComment(uuid);
            return res
                .status(200)
                .send(this.responseMessage('comment', 'Delete', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Update Child Comment Show
    @Put('/child-show/:uuid')
    async updateForumCommentChildShow(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: ForumCommentChildShowDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(ForumCommentChildShowDTO, dto);
            const result =
                await this.commentService.updateForumCommentChildShow(
                    uuid,
                    dto,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Forum',
                        'Update Child Comment Show',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }
}
