import { Merchandise, MerchandiseImage } from '@prisma/clients/nex-level';
import {
  GetUsersQueryDTO,
  MerchandiseDTO,
  MerchandiseImageDTO,
  PinUnpinDTO,
} from '../dtos/merchandise.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface MerchandiseServiceInterface {
  getMerchandise(
    queryParams: GetUsersQueryDTO,
  ): Promise<ResponseDTO<Merchandise[]>>;

  filterMerchandise(
    page: number,
    limit: number,
    search: string,
    minPoint: number,
    maxPoint: number,
    sortBy: string,
  ): Promise<ResponseDTO<Merchandise[]>>;

  getMerchandiseByUuid(uuid: string): Promise<Merchandise>;

  createMerchandise(dto: MerchandiseDTO): Promise<Merchandise>;

  updateMerchandiseByUUID(
    uuid: string,
    dto: MerchandiseDTO,
  ): Promise<Merchandise>;

  pinUnpin(uuid: string, dto: PinUnpinDTO): Promise<Merchandise>;

  deleteMerchandiseByUUID(uuid: string): Promise<Merchandise>;

  createImageMerchandise(dto: MerchandiseImageDTO): Promise<MerchandiseImage>;

  updateImageMerchandise(
    dto: MerchandiseImageDTO,
  ): Promise<MerchandiseImage>;


  deleteMerchandiseImage(uuid: string): Promise<MerchandiseImage>;
}
