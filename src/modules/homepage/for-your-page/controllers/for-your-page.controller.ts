import { ForYourPageService } from './../services/for-your-page.service';
import {
    BadRequestException,
    Controller,
    Get,
    Query,
    Res,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { ForYourPageControllerInterface } from '../interfaces/for-your-page-controller.interface';
import { Response } from 'express';

@Controller({ path: 'api/for-your-page', version: '1' })
export class ForYourPageController
    extends BaseController
    implements ForYourPageControllerInterface
{
    constructor(private readonly fypService: ForYourPageService) {
        super(ForYourPageController.name);
    }

    @Get()
    async getForYourPage(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            if (!personalNumber) {
                throw new BadRequestException('personalNumber is required!');
            }
            const result = await this.fypService.getForYourPage(
                page,
                limit,
                personalNumber,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'for your page',
                        'Getting',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }
}
