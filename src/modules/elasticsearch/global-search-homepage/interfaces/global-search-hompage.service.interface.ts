import { GlobalSearchResultDTO, LastSortDTO } from '../dtos/global-search.dto';

export interface GlobalSearchHomepageServiceInterface {
  globalSearch(
    query: string,
    prevSort: LastSortDTO,
  ): Promise<GlobalSearchResultDTO>;

  getTrendingSearch(): Promise<string[]>;
}
