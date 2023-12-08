import {
    BadRequestException,
    Controller,
    Get,
    Query,
    Res,
} from '@nestjs/common';
import { LearningFuseService } from './learning.fuse.service';
import { LearningFuseControllerInterface } from './learning.fuse.controller.interface';
import { Response } from 'express';
import { BaseController } from 'src/core/controllers/base.controller';

@Controller({ path: 'api/search-learning', version: '1' })
export class LearningFuseController
    extends BaseController
    implements LearningFuseControllerInterface
{
    constructor(private readonly learningFuseService: LearningFuseService) {
        super(LearningFuseController.name);
    }

    @Get('result-interest')
    async showResultByInterest(
        @Res() res: Response<any, Record<string, any>>,
        @Query('search') search: string[],
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.learningFuseService.showResultSearchByInterest(
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
        @Query('page') page: number,
        @Query('limit') limit: number,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (!limit) {
                throw new BadRequestException('limit is required!');
            }
            const result = await this.learningFuseService.showResultSearch(
                search,
                page,
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
            const result = await this.learningFuseService.showTrendingSearch();
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
                const result = await this.learningFuseService.getSuggestion(
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
