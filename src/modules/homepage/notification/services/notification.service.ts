import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import { Notification } from '@prisma/clients/homepage';
import {
    CreateNotifDTO,
    GetUsersQueryDTO,
    ReadNotifDTO,
} from '../dtos/notification.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { NotificationServiceInterface } from '../interfaces';

@Injectable()
export class NotificationService
    extends AppError
    implements NotificationServiceInterface
{
    constructor(private prisma: PrismaHomepageService) {
        super(NotificationService.name);
    }

    async createNotif(dto: CreateNotifDTO): Promise<Notification> {
        return await this.prisma.notification.create({
            data: { ...dto },
        });
    }

    async findAllByReceiverPersonnelNumber(
        receiverPersonnelNumber: string,
        queryParams: GetUsersQueryDTO,
    ): Promise<ResponseDTO<Notification[]>> {
        const take = queryParams.limit;
        const skip = (queryParams.page - 1) * take;

        const notifications: Notification[] =
            await this.prisma.notification.findMany({
                where: {
                    receiverPersonalNumber: receiverPersonnelNumber,
                },
                orderBy: { createdAt: 'desc' },
                take,
                skip,
            });

        this.handlingErrorEmptyData(notifications, 'notif');
        const result: ResponseDTO<Notification[]> = {
            result: notifications,
            total: notifications.length,
        };

        return result;
    }

    async findAllNotif(
        filter: GetUsersQueryDTO,
    ): Promise<ResponseDTO<Notification[]>> {
        const take = filter.limit;
        const skip = (filter.page - 1) * take;

        const notifications: Notification[] =
            await this.prisma.notification.findMany({
                take,
                skip,
                orderBy: { createdAt: 'desc' },
            });

        this.handlingErrorEmptyData(notifications, 'notif');
        const result: ResponseDTO<Notification[]> = {
            result: notifications,
            total: notifications.length,
        };

        return result;
    }

    async findByUuid(uuid: string): Promise<Notification> {
        const notif = await this.prisma.notification.findUnique({
            where: { uuid },
        });

        this.handlingErrorNotFound(notif, uuid, 'notif');

        return await this.prisma.notification.findUnique({
            where: { uuid },
        });
    }

    async readNotif(uuid: string, dto: ReadNotifDTO): Promise<Notification> {
        const notif: Notification = await this.prisma.notification.findUnique({
            where: { uuid },
        });

        this.handlingErrorNotFound(notif, uuid, 'notif');

        return await this.prisma.notification.update({
            where: { uuid },
            data: {
                isRead: dto.isRead,
            },
        });
    }

    async readAllNotif(dto: ReadNotifDTO): Promise<void> {
        await this.prisma.notification.updateMany({
            where: { isRead: false },
            data: { isRead: dto.isRead },
        });
    }

    async deleteNotif(uuid: string): Promise<void> {
        const notif = await this.prisma.notification.findUnique({
            where: { uuid },
        });

        this.handlingErrorNotFound(notif, uuid, 'notif');
        await this.prisma.notification.delete({
            where: { uuid },
        });
    }
}
