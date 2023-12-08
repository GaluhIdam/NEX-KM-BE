import { Response } from 'express';
import { WebDirectoryDTO } from '../dtos/web-directory.dto';
import { WebDirectoryStatusDTO } from '../dtos/web-directory-status.dto';

export interface WebDirectoryControllerInterface {
  getWebDirectory(
    res: Response,
    page: number,
    limit: number,
    search?: string,
    id_unit?: number,
    status?: string,
    sortBy?: string,
    personalNumber?: string,
  ): Promise<Response>;

  getWebDirectoryById(res: Response, uuid: string): Promise<Response>;

  createWebDirectory(
    res: Response,
    dto: WebDirectoryDTO,
    cover_image: Express.Multer.File,
  ): Promise<Response>;

  updateWebDirectory(
    res: Response,
    uuid: string,
    dto: WebDirectoryDTO,
    cover_image: Express.Multer.File,
  ): Promise<Response>;

  updateWebDirectoryStatus(
    res: Response,
    uuid: string,
    dto: WebDirectoryStatusDTO,
  ): Promise<Response>;

  deleteWebDirectory(res: Response, uuid: string): Promise<Response>;
}
