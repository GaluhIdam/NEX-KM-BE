import { Response } from 'express';
import { MilesDTO } from '../dtos/miles.dto';

export interface MilesControllerInterface {

  getAllMile(res: Response): Promise<Response>;

  getMiles(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<Response>;

  getMilesByUuid(res: Response, uuid: string): Promise<Response>;

  createMiles(
    res: Response,
    data: MilesDTO,
    image: Express.Multer.File,
  ): Promise<Response>;

  updateMiles(
    res: Response,
    uuid: string,
    data: MilesDTO,
    image: Express.Multer.File,
  ): Promise<Response>;

  deleteMiles(res: Response, uuid: string): Promise<Response>;
}
