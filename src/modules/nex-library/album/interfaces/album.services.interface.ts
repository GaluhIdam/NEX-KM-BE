import { Album } from '@prisma/clients/nex-library';
import { AlbumDTO } from '../dtos/album.dto';
import { AlbumStatusDTO } from '../dtos/album-status.dto';
import { AlbumStatusApprovalDTO } from '../dtos/album-status-approval.dto';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';

export interface AlbumServiceInterface {
  getAlbum(
    page: number,
    limit: number,
    search?: string,
    id_album_category?: number,
    personalNumber?: string,
    sortBy?: string,
    status?: boolean,
    approvalStatus?: string,
  ): Promise<PaginationDTO<Album[]>>;

  getAlbumByPersonalNumber(
    personal_number: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<Album[]>;

  getAlbumById(uuid: string): Promise<Album>;

  getAlbumByPk(id_album: number): Promise<Album>;

  createAlbum(dto: AlbumDTO): Promise<Album>;

  updateAlbum(uuid: string, dto: AlbumDTO): Promise<Album>;

  updateAlbumStatus(uuid: string, dto: AlbumStatusDTO): Promise<Album>;

  updateAlbumStatusApproval(
    uuid: string,
    dto: AlbumStatusApprovalDTO,
  ): Promise<Album>;

  deleteAlbum(uuid: string): Promise<Album>;
}
