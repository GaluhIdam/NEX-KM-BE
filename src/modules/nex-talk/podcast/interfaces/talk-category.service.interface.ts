import { TalkCategory } from '@prisma/clients/nex-talk';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
import { TalkCategoryDTO } from '../dtos/talk-category.dto';
import { TalkCategoryStatusDTO } from '../dtos/talk-category-status.dto';

export interface TalkCategoryServiceInterface {
  getTalkCategory(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    status?: boolean,
  ): Promise<PaginationDTO<TalkCategory[]>>;

  getTalkCategoryById(uuid: string): Promise<TalkCategory>;

  createTalkCategory(dto: TalkCategoryDTO): Promise<TalkCategory>;

  updateTalkCategory(uuid: string, dto: TalkCategoryDTO): Promise<TalkCategory>;

  deleteTalkCategory(uuid: string): Promise<TalkCategory>;

  updateTalkCategoryStatus(
    uuid: string,
    dto: TalkCategoryStatusDTO,
  ): Promise<TalkCategory>;
}
