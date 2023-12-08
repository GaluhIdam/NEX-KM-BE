import { Response } from 'express';
import { TalkCategoryDTO } from '../dtos/talk-category.dto';
import { TalkCategoryStatusDTO } from '../dtos/talk-category-status.dto';

export interface TalkCategoryControllerInterface {
  getTalkCategory(
    res: Response,
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    status?: string,
  ): Promise<Response>;

  createTalkCategory(res: Response, dto: TalkCategoryDTO): Promise<Response>;

  updateTalkCategory(
    res: Response,
    uuid: string,
    dto: TalkCategoryDTO,
  ): Promise<Response>;

  deleteTalkCategory(res: Response, uuid: string): Promise<Response>;

  updateTalkCategoryStatus(
    res: Response,
    uuid: string,
    dto: TalkCategoryStatusDTO,
  ): Promise<Response>;
}
