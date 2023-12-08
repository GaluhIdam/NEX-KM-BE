import { Response } from 'express';
import { LastSortDTO } from '../dtos/global-search.dto';

export interface GlobalSearchHomepageControllerInterface {
  globalSearch(
    res: Response,
    query: string,
    prevSort: LastSortDTO,
  ): Promise<Response>;

  getTrendingSearch(res: Response): Promise<Response>;
}
