import { ResponseDTO } from 'src/core/dtos/response.dto';
import { SharingExpDTO } from '../dtos/sharing-exp.dto';
import { SharingExp } from '@prisma/clients/homepage';

export interface SharingExpServiceInterface {
  getSharingExpByUuid(uuid: string): Promise<SharingExp>;
  getSharingExp(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    isAdmin: boolean,
  ): Promise<ResponseDTO<SharingExp[]>>;
  createSharingExp(dto: SharingExpDTO): Promise<SharingExp>;
  updateSharingExp(uuid: string, dto: SharingExpDTO): Promise<SharingExp>;
  deleteSharingExp(uuid: string): Promise<SharingExp>;
}
