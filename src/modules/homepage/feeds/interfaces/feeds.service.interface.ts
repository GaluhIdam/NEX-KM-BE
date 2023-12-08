import { FeedsResultDTO, QueryParams } from '../dtos/feeds.dto';
import { SearchHitsMetadata } from '@elastic/elasticsearch/lib/api/types';

export interface FeedsServiceInterface {
    getFeeds(
        personnelNumber: string,
        query: QueryParams,
    ): Promise<SearchHitsMetadata<FeedsResultDTO>>;
}
