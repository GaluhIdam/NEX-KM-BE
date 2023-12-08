import { AlbumCategory } from '@prisma/clients/nex-library';
import { AlbumCategoryDTO } from '../dtos/album-category.dto';
import { AlbumCategoryStatusDTO } from '../dtos/album-category-status.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';

export interface AlbumCategoryServiceInterface {
  getAlbumCategory(
    page: number,
    limit: number,
    search?: string,
    is_active?: boolean,
  ): Promise<PaginationDTO<AlbumCategory[]>>;

  getAlbumCategoryById(id_album_category: number): Promise<AlbumCategory>;

  createAlbumCategory(dto: AlbumCategoryDTO): Promise<AlbumCategory>;

  updateAlbumCategory(
    uuid: string,
    dto: AlbumCategoryDTO,
  ): Promise<AlbumCategory>;

  updateAlbumCategoryStatus(
    uuid: string,
    dto: AlbumCategoryStatusDTO,
  ): Promise<AlbumCategory>;

  deleteAlbumCategory(uuid: string): Promise<AlbumCategory>;
}
