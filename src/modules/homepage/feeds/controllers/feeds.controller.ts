import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { FeedsService } from '../services/feeds.service';
import { FeedControllerInterface } from '../interfaces/feeds.controller.interface';
import { Response } from 'express';
import { BaseController } from 'src/core/controllers/base.controller';
import { QueryParams } from '../dtos/feeds.dto';

@Controller({ version: '1', path: 'api/feeds' })
export class FeedsController
    extends BaseController
    implements FeedControllerInterface {
    constructor(private readonly feedsService: FeedsService) {
        super(FeedsController.name);
    }

    @Get(':personnelNumber')
    async getFeeds(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personnelNumber') personnelNumber: string,
        @Query() queryParams: QueryParams,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.feedsService.getFeeds(
                personnelNumber,
                queryParams,
            );

            return res
                .status(200)
                .send(this.responseMessage('Feeds', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }
}
