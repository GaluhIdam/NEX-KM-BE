import { Response } from 'express';
import { PointConfigDTO } from '../dtos/point-config.dto';

export interface PointConfigControllerInterface {
  getPointConfig(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<Response>;

  getPointConfigByUUID(res: Response, uuid: string): Promise<Response>;

  createPointConfig(res: Response, data: PointConfigDTO): Promise<Response>;

  updatePointConfig(
    res: Response,
    uuid: string,
    data: PointConfigDTO,
  ): Promise<Response>;

  deletePointConfig(res: Response, uuid: string): Promise<Response>;
}
