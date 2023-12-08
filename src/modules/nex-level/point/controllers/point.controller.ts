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
import { Response } from 'express';
import { PointControllerInterface } from '../interfaces/point.controller.interface';
import { HistoryPointDTO, LoginDTO, PointDTO } from '../dtos/point.dto';
import { PointService } from '../services/point.service';

@Controller({ path: 'api/point', version: '1' })
export class PointController
    extends BaseController
    implements PointControllerInterface
{
    constructor(private readonly pointService: PointService) {
        super(PointController.name);
    }

    @Get('point-of-year/:personalNumber')
    async getPointofYear(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.pointService.getPointofYear(
                personalNumber,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage('point of year', 'Get', 200, result),
                );
        } catch (error) {
            throw error;
        }
    }

    @Get('history-point-user')
    async getHistoryPointByPersonalNumber(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('sortBy') sortBy: string,
        @Query('personalNumber') personalNumber: string,
        @Query('year') year: number,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            const result =
                await this.pointService.getHistoryPointByPersonalNumber(
                    page,
                    limit,
                    search,
                    sortBy,
                    personalNumber,
                    year,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage('history point', 'Get', 200, result),
                );
        } catch (error) {
            throw error;
        }
    }

    @Get('history-point')
    async getHistoryPoint(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('sortBy') sortBy: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            const result = await this.pointService.getHistoryPoint(
                page,
                limit,
                search,
                sortBy,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage('history point', 'Get', 200, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Create History Point
    @Post('history-point')
    async createHistoryPoint(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: HistoryPointDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.pointService.createHistoryPoint(dto);
            return res
                .status(201)
                .send(
                    this.responseMessage('history point', 'Get', 201, result),
                );
        } catch (error) {
            throw error;
        }
    }

    @Post('login')
    async loginDaily(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: LoginDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const checkLogin = await this.pointService.findHistoryPoint(
                dto.personalNumber,
            );
            if (!checkLogin) {
                const result = await this.checkPoint(
                    'Daily Login',
                    dto.personalNumber,
                    true,
                );
                return res
                    .status(200)
                    .send(this.responseMessage('point', 'Get', 200, result));
            }
            return res
                .status(200)
                .send(this.responseMessage('point', 'Get', 200, checkLogin));
        } catch (error) {
            throw error;
        }
    }

    @Get(':personalNumber')
    async getPointByPersonalNumber(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.pointService.getPointByPersonalNumber(
                personalNumber,
            );
            return res
                .status(200)
                .send(this.responseMessage('point', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Get Point with Pagination
    @Get()
    async getPoint(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('sortBy') sortBy: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            const result = await this.pointService.getPoint(
                page,
                limit,
                search,
                sortBy,
            );
            return res
                .status(200)
                .send(this.responseMessage('point', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Create Point
    @Post()
    async createPoint(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: PointDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.pointService.createPoint(dto);
            return res
                .status(201)
                .send(this.responseMessage('point', 'create', 201, result));
        } catch (error) {
            throw error;
        }
    }

    //Update Point
    @Put(':uuid')
    async updatePoint(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: PointDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.pointService.updatePoint(uuid, dto);
            return res
                .status(200)
                .send(this.responseMessage('point', 'update', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Delete Point
    @Delete(':uuid')
    async deletePoint(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.pointService.deletePoint(uuid);
            return res
                .status(200)
                .send(this.responseMessage('point', 'delete', 200, result));
        } catch (error) {
            throw error;
        }
    }
}
