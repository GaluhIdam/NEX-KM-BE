import { Response } from 'express';
import { SharingExpDTO } from '../dtos/sharing-exp.dto';

export interface SharingExpControllerInterface {
  getSharingExpByUuid(res: Response, uuid: string): Promise<Response>;
  getSharingExp(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    isAdmin: boolean,
  ): Promise<Response>;
  createSharingExp(res: Response, dto: SharingExpDTO): Promise<Response>;
  updateSharingExp(
    res: Response,
    uuid: string,
    dto: SharingExpDTO,
  ): Promise<Response>;
  deleteSharingExp(res: Response, uuid: string): Promise<Response>;
}
