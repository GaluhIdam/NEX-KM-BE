import { AlbumGallery } from '@prisma/clients/nex-library';
import { AlbumGalleryDTO } from '../dtos/album-gallery.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
export interface AlbumGalleryServiceInterface {
  getAlbumGallery(
    page: number,
    limit: number,
  ): Promise<PaginationDTO<AlbumGallery[]>>;

  getAlbumGalleryById(uuid: string): Promise<AlbumGallery>;

  getAlbumGalleryByAlbumId(id_album: number): Promise<AlbumGallery[]>;

  getAlbumGalleryPaginateByAlbumId(
    id_album: number,
    page: number,
    limit: number,
  ): Promise<PaginationDTO<AlbumGallery[]>>;

  createAlbumGallery(dto: AlbumGalleryDTO): Promise<AlbumGallery>;

  updateAlbumGallery(uuid: string, dto: AlbumGalleryDTO): Promise<AlbumGallery>;

  deleteAlbumGallery(uuid: string): Promise<AlbumGallery>;
}
