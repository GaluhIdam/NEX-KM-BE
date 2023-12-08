import { Response } from 'express';
import { RedeedUpdateDTO, RedeemDTO } from '../dtos/redeem.dto';

export interface RedeemControllerInterface {
  getRedeem(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<Response>;

  getRedeemByPersonalNumber(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    personalNumber: string,
  ): Promise<Response>;

  getRedeemByUuid(res: Response, uuid: string): Promise<Response>;


  createRedeem(res: Response, data: RedeemDTO): Promise<Response>;

  updateRedeem(
    res: Response,
    uuid: string,
    data: RedeedUpdateDTO,
  ): Promise<Response>;

  deleteRedeem(res: Response, uuid: string): Promise<Response>;
}
