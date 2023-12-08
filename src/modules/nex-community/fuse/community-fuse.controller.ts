import {
    BadRequestException,
    Controller,
    Get,
    Query,
    Res,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { CommunityFuseControllerInterface } from './community-fuse.controller.interface';
import { CommunityFuseService } from './community-fuse.service';
import { Response } from 'express';

@Controller({ path: 'api/search-community', version: '1' })
export class CommunityFuseController
    extends BaseController
    implements CommunityFuseControllerInterface
{
    constructor(private readonly communityFuseService: CommunityFuseService) {
        super(CommunityFuseController.name);
    }

    @Get('result-interest')
    async showResultByInterest(
        @Res() res: Response<any, Record<string, any>>,
        @Query('search') search: string[],
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.communityFuseService.showResultSearchByInterest(
                    search,
                );
            return res.status(200).send(result);
        } catch (error) {
            throw error;
        }
    }

    @Get('result')
    async showResult(
        @Res() res: Response<any, Record<string, any>>,
        @Query('search') search: string,
        @Query('limit') limit: number,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (!limit) {
                throw new BadRequestException('limit is required!');
            }
            const result = await this.communityFuseService.showResultSearch(
                search,
                limit,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'result form search engine',
                        'Get',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    @Get('trending')
    async showTrendingSearch(
        @Res() res: Response<any, Record<string, any>>,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.communityFuseService.showTrendingSearch();
            return res.status(200).send(result);
        } catch (error) {
            throw error;
        }
    }

    @Get()
    async getSuggestion(
        @Res() res: Response<any, Record<string, any>>,
        @Query('search') search: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (search.length > 0) {
                const result = await this.communityFuseService.getSuggestion(
                    search,
                );
                return res.status(200).send(result);
            }
            return res.status(200).send([]);
        } catch (error) {
            throw error;
        }
    }
}
