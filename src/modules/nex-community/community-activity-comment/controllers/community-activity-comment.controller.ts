import {
    BadRequestException,
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
import { CommunityCommentActivityControllersInterface } from '../interfaces/community-activity-comment.controller.interface';
import { Response } from 'express';
import { ActivityCommentDTO } from '../dto/comment-activity.dto';
import { CommunityActivityCommentService } from '../services/community-activity-comment.service';

@Controller({ path: 'api/community-activity-comment', version: '1' })
export class CommunityActivityCommentController
    extends BaseController
    implements CommunityCommentActivityControllersInterface
{
    constructor(
        private readonly communityActivityCommentService: CommunityActivityCommentService,
    ) {
        super(CommunityActivityCommentController.name);
    }

    @Get()
    async getCommentActivity(
        @Res() res: Response<any, Record<string, any>>,
        @Query('activityId') activityId: number,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('sortBy') sortBy: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (!activityId) {
                throw new BadRequestException('activityId is required!');
            }
            this.validatePageLimit(page, limit);
            const result =
                await this.communityActivityCommentService.getCommentActivity(
                    activityId,
                    page,
                    limit,
                    sortBy,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'comment activity',
                        'Get',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    @Get('/get-child-comment')
    async getChildCommentActivity(
        @Res() res: Response<any, Record<string, any>>,
        @Query('activityId') activityId: number,
        @Query('parentId') parentId: number,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('sortBy') sortBy: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (!activityId || !parentId) {
                throw new BadRequestException(
                    'activityId & parentId is required!',
                );
            }
            this.validatePageLimit(page, limit);
            const result =
                await this.communityActivityCommentService.getChildCommentActivity(
                    activityId,
                    parentId,
                    page,
                    limit,
                    sortBy,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'child comment activity',
                        'Get',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    @Post()
    async createComment(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: ActivityCommentDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            await this.errorsValidation(ActivityCommentDTO, dto);
            const result =
                await this.communityActivityCommentService.createComment(dto);
            return res
                .status(201)
                .send(
                    this.responseMessage(
                        'comment activity',
                        'Create',
                        201,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    @Put(':uuid')
    async updateComment(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: ActivityCommentDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(ActivityCommentDTO, dto);
            const result =
                await this.communityActivityCommentService.updateComment(
                    uuid,
                    dto,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'activity comment',
                        'Update',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    @Delete(':uuid')
    async deleteCommunity(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.communityActivityCommentService.deleteCommunity(
                    uuid,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'activity comment',
                        'Delete',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }
}
