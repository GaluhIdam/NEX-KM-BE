import { WebDirectory } from '@prisma/clients/nex-library';
import { WebDirectoryDTO } from '../dtos/web-directory.dto';
import { WebDirectoryStatusDTO } from '../dtos/web-directory-status.dto';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';

export interface WebDirectoryServiceInterface {
  getWebDirectory(
    page: number,
    limit: number,
    search?: string,
    id_unit?: number,
    status?: boolean,
    sortBy?: string,
    personalNumber?: string,
  ): Promise<PaginationDTO<WebDirectory[]>>;

  getWebDirectoryById(uuid: string): Promise<WebDirectory>;

  createWebDirectory(dto: WebDirectoryDTO): Promise<WebDirectory>;

  updateWebDirectory(uuid: string, dto: WebDirectoryDTO): Promise<WebDirectory>;

  updateWebDirectoryStatus(
    uuid: string,
    dto: WebDirectoryStatusDTO,
  ): Promise<WebDirectory>;

  deleteWebDirectory(uuid: string): Promise<WebDirectory>;
}
