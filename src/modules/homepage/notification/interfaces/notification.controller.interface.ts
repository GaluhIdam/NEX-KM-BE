import { Response } from 'express';
import {
  CreateNotifDTO,
  GetUsersQueryDTO,
  ReadNotifDTO,
} from '../dtos/notification.dto';

export interface NotificationControllerInterface {
  createNotif(res: Response, dto: CreateNotifDTO): Promise<Response>;

  findAllNotif(res: Response, query: GetUsersQueryDTO): Promise<Response>;

  findByUuid(res: Response, uuid: string): Promise<Response>;

  findAllByReceiverPersonnelNumber(
    res: Response,
    receiverPersonnelNumber: string,
    queryParams: GetUsersQueryDTO,
  ): Promise<Response>;

  readNotif(res: Response, uuid: string, dto: ReadNotifDTO): Promise<Response>;

  readAllNotif(res: Response, dto: ReadNotifDTO): Promise<Response>;

  deleteNotif(uuid: string): Promise<void>;
}
