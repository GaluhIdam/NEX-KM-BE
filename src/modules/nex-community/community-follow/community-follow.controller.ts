import { BaseController } from 'src/core/controllers/base.controller';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
} from '@nestjs/common';
import { CommunityFollowControllerInterface } from './interface/community-follow.controller.interface';
import { Response } from 'express';
import { CommunityFollowDTO } from './dtos/community-follow.dto';
import { CommunityFollowService } from './services/community-follow.service';

@Controller({ path: 'api/community-follow', version: '1' })
export class CommunityFollowController
    extends BaseController
    implements CommunityFollowControllerInterface
{
    constructor(
        private readonly communityFollowService: CommunityFollowService,
    ) {
        super(CommunityFollowController.name);
    }

    @Get('community-user/:personalNumber')
    async getCommunityUser(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (!personalNumber) {
                throw new BadRequestException(
                    'params personalNumber is required!',
                );
            }
            const result = await this.communityFollowService.getCommunityUser(
                personalNumber,
            );
            return res
                .status(200)
                .send(this.responseMessage('community', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Get('check-follower')
    async getCommunityFollowByPersonalNumber(
        @Res() res: Response<any, Record<string, any>>,
        @Query('personalNumber') personalNumber: string,
        @Query('communityId') communityId: number,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (!personalNumber || !communityId) {
                throw new BadRequestException(
                    'personalNumber & communityId is required!',
                );
            }
            const result =
                await this.communityFollowService.getCommunityFollowByPersonalNumber(
                    personalNumber,
                    communityId,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'community follow',
                        'Get',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    @Get(':communityId')
    async getCommunityFollow(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Param('communityId') communityId: number,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            const result = await this.communityFollowService.getCommunityFollow(
                page,
                limit,
                communityId,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'community follow',
                        'Get',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw new HttpException(
                'Oops! Data is empty.',
                HttpStatus.NOT_FOUND,
            );
        }
    }

    @Post()
    async createCommunityFollow(
        @Res() res: Response<any, Record<string, any>>,
        @Body() data: CommunityFollowDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.communityFollowService.createCommunityFollow(data);
            return res.status(201).send(result);
        } catch (error) {
            throw new HttpException(
                'Oops! Create data failed',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Delete('/:uuid')
    async deleteCommunityFollow(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.communityFollowService.deleteCommunityFollow(uuid);
            return res.status(200).send(result);
        } catch (error) {
            throw new HttpException(
                'Oops! UUID not found.',
                HttpStatus.NOT_FOUND,
            );
        }
    }
}
