import { Response } from 'express';
import {
  GetUsersQueryDTO,
  MerchandiseDTO,
  MerchandiseImageDTO,
  PinUnpinDTO,
} from '../dtos/merchandise.dto';

export interface MerchandiseControllerInterface {
  getMerchandise(
    res: Response,
    queryParams: GetUsersQueryDTO,
  ): Promise<Response>;

  filterMerchandise(
    res: Response,
    page: number,
    limit: number,
    search: string,
    minPoint: number,
    maxPoint: number,
    sortBy: string,
  ): Promise<Response>;

  getMerchandiseByUuid(res: Response, uuid: string): Promise<Response>;

  createMerchandise(res: Response, dto: MerchandiseDTO): Promise<Response>;

  updateMerchandise(
    res: Response,
    uuid: string,
    dto: MerchandiseDTO,
  ): Promise<Response>;

  pinUnpin(res: Response, uuid: string, dto: PinUnpinDTO): Promise<Response>;

  deleteMerchandise(res: Response, uuid: string): Promise<Response>;

  createImageMerchandise(
    res: Response,
    dto: MerchandiseImageDTO,
    image: Express.Multer.File,
  ): Promise<Response>;

  updateImageMerchandise(
    res: Response,
    dto: MerchandiseImageDTO,
    image: Express.Multer.File,
  ): Promise<Response>;

  deleteImageMerchandise(res: Response, uuid: string): Promise<Response>;
}
