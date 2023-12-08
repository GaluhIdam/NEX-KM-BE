import { Response } from 'express';

export interface AlbumGalleryControllerInterface {

  getAlbumGallery(res: Response, page: number, limit: number): Promise<Response>;

  createAlbumGallery<T>(res: Response, images: Express.Multer.File[], dto: Array<T>,): Promise<Response>;

  updateAlbumGallery(res: Response, images: Express.Multer.File[], req: any): Promise<Response>;

  deleteAlbumGallery(res: Response, req: any): Promise<Response>
}