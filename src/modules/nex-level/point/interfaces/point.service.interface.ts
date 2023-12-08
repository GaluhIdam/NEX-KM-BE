import { Point } from '@prisma/clients/nex-level';
import { PointDTO } from '../dtos/point.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface PointServiceInterface {
  getPoint(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Point[]>>;

  getPointByPersonalNumber(personalNumber: string): Promise<Point>;

  createPoint(dto: PointDTO): Promise<Point>;

  updatePoint(uuid: string, dto: PointDTO): Promise<Point>;

  deletePoint(uuid: string): Promise<Point>;
}
