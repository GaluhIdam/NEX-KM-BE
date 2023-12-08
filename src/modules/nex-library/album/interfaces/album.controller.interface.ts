import { Response } from 'express';
import { AlbumStatusDTO } from '../dtos/album-status.dto';
import { AlbumStatusApprovalDTO } from '../dtos/album-status-approval.dto';

export interface AlbumControllerInterface {
  getAlbum(
    res: Response,
    page: number,
    limit: number,
    search?: string,
    id_album_category?: number,
    personalNumber?: string,
    sortBy?: string,
    status?: string,
    approval_status?: string,
  ): Promise<Response>;

  getAlbumByPersonalNumber(
    res: Response,
    personal_number: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<Response>;

  getAlbumById(res: Response, uuid: string): Promise<Response>;

  createAlbum(
    res: Response,
    image: Express.Multer.File,
    dto: any,
  ): Promise<Response>;

  updateAlbum(
    res: Response,
    uuid: string,
    dto: any,
    image: Express.Multer.File,
  ): Promise<Response>;

  updateAlbumStatus(
    res: Response,
    uuid: string,
    dto: AlbumStatusDTO,
  ): Promise<Response>;

  updateAlbumStatusApproval(
    res: Response,
    uuid: string,
    dto: AlbumStatusApprovalDTO,
  ): Promise<Response>;

  deleteAlbum(res: Response, uuid: string): Promise<Response>;
}
