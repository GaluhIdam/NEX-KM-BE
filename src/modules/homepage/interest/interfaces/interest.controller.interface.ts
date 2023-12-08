import { Response } from 'express';
// import { Interest } from '@prisma/clients/homepage';
// import { ResponseDTO } from 'src/core/dtos/response.dto';
import { InterestDTO } from '../dtos/interest.dto';
export interface InterestControllerInterface {
  getInterest(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<Response>;

  createInterest(res: Response, dto: InterestDTO): Promise<Response>;

  updateInterest(
    res: Response,
    uuid: string,
    dto: InterestDTO,
  ): Promise<Response>;

  deleteInterest(res: Response, uuid: string): Promise<Response>;
}
