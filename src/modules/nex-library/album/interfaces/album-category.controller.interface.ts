import { Response } from 'express';
import { AlbumCategoryDTO } from '../dtos/album-category.dto';
import { AlbumCategoryStatusDTO } from '../dtos/album-category-status.dto';

export interface AlbumCategoryControllerInterface {
  getAlbumCategory(
    res: Response,
    page: number,
    limit: number,
    search?: string,
    isActive?: string,
  ): Promise<Response>;

  createAlbumCategory(res: Response, data: AlbumCategoryDTO): Promise<Response>;

  updateAlbumCategory(
    res: Response,
    uuid: string,
    data: AlbumCategoryDTO,
  ): Promise<Response>;

  updateAlbumCategoryStatus(
    res: Response,
    uuid: string,
    data: AlbumCategoryStatusDTO,
  ): Promise<Response>;

  deleteAlbumCategory(res: Response, uuid: string): Promise<Response>;
}
