import { ResponseDTO } from 'src/core/dtos/response.dto';
import {
  CreateNotifDTO,
  GetUsersQueryDTO,
  ReadNotifDTO,
} from '../dtos/notification.dto';
import { Notification } from '@prisma/clients/homepage';

export interface NotificationServiceInterface {
  createNotif(dto: CreateNotifDTO): Promise<Notification>;

  findAllNotif(query: GetUsersQueryDTO): Promise<ResponseDTO<Notification[]>>;

  findByUuid(uuid: string): Promise<Notification>;

  findAllByReceiverPersonnelNumber(
    receiverPersonnelNumber: string,
    queryParams: GetUsersQueryDTO,
  ): Promise<ResponseDTO<Notification[]>>;

  readNotif(uuid: string, dto: ReadNotifDTO): Promise<Notification>;

  readAllNotif(dto: ReadNotifDTO): Promise<void>;

  deleteNotif(uuid: string): Promise<void>;
}
