import { Redeems } from '@prisma/clients/nex-level';
import { RedeedUpdateDTO, RedeemDTO } from '../dtos/redeem.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface RedeemServiceInterface {
  getRedeem(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Redeems[]>>;

  getRedeemByPersonalNumber(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    personalNumber: string,
  ): Promise<ResponseDTO<Redeems[]>>;

  getRedeemByUuid(uuid: string): Promise<Redeems>;

  createRedeem(dto: RedeemDTO): Promise<Redeems>;

  updateRedeemByUUID(uuid: string, dto: RedeedUpdateDTO): Promise<Redeems>;

  deleteRedeemByUUID(uuid: string): Promise<Redeems>;
}
