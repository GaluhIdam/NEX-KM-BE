import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { BaseController } from 'src/core/controllers/base.controller';
import { Response } from 'express';
import {
    CreateNotifDTO,
    GetUsersQueryDTO,
    ReadNotifDTO,
} from '../dtos/notification.dto';
import { NotificationControllerInterface } from '../interfaces';

@Controller({ path: 'api/notification', version: '1' })
export class NotificationController
    extends BaseController
    implements NotificationControllerInterface
{
    constructor(private readonly notificationService: NotificationService) {
        super(NotificationController.name);
    }

    @Post()
    async createNotif(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: CreateNotifDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.notificationService.createNotif(dto);

            return res
                .status(201)
                .send(this.responseMessage('notif', 'Create', 201, result));
        } catch (error) {
            throw error;
        }
    }

    @Get()
    async findAllNotif(
        @Res() res: Response<any, Record<string, any>>,
        @Query() queryParams: GetUsersQueryDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(queryParams.page, queryParams.limit);
            const result = await this.notificationService.findAllNotif(
                queryParams,
            );

            return res
                .status(200)
                .send(this.responseMessage('notif', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Get(':receiverPersonnelNumber')
    async findAllByReceiverPersonnelNumber(
        @Res() res: Response<any, Record<string, any>>,
        @Param('receiverPersonnelNumber') receiverPersonnelNumber: string,
        @Query() queryParams: GetUsersQueryDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(queryParams.page, queryParams.limit);
            const result =
                await this.notificationService.findAllByReceiverPersonnelNumber(
                    receiverPersonnelNumber,
                    queryParams,
                );

            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'notif by receiver personnal number',
                        'Get',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    @Get(':uuid')
    async findByUuid(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validateUUID(uuid);
            const result = await this.notificationService.findByUuid(uuid);

            return res
                .status(200)
                .send(this.responseMessage('notif', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Put('read/:uuid')
    async readNotif(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: ReadNotifDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validateUUID(uuid);
            const result = await this.notificationService.readNotif(uuid, dto);

            return res
                .status(200)
                .send(this.responseMessage('notif', 'Read', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Put('read-all-notif')
    async readAllNotif(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: ReadNotifDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.notificationService.readAllNotif(dto);

            return res
                .status(200)
                .send(this.responseMessage('notif', 'Read all', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Delete(':uuid')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteNotif(@Param('uuid') uuid: string): Promise<void> {
        try {
            this.validateUUID(uuid);
            await this.notificationService.deleteNotif(uuid);
        } catch (error) {
            throw error;
        }
    }
}
