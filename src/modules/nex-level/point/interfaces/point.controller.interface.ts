import { Response } from 'express';
import { PointDTO } from '../dtos/point.dto';

export interface PointControllerInterface {
  getPoint(res: Response, page: number, limit: number, search: string, sortBy: string): Promise<Response>;

  getPointByPersonalNumber(res: Response, personalNumber: string): Promise<Response>

  createPoint(res: Response, dto: PointDTO): Promise<Response>;

  updatePoint(res: Response, uuid: string, dto: PointDTO): Promise<Response>;

  deletePoint(res: Response, uuid: string): Promise<Response>;
}
