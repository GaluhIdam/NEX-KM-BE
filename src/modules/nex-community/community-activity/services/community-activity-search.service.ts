import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EsIndex } from 'src/core/enums';
import { CommunityActivities } from '@prisma/clients/nex-community';
import { CommunityActivitySearchResultDTO } from '../dtos/community-activity.dto';
import {
  AggregationsAggregate,
  OpenPointInTimeResponse,
  SearchResponse,
  SortResults,
} from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class CommunityActivitysearchService {
  private readonly resultSize: number = 6;

  constructor(private readonly esService: ElasticsearchService) { }

  async indexCommunityActivity(
    communityActivity: CommunityActivities,
  ): Promise<Record<string, any>> {
    const exists: boolean = await this.checkIndexExists(communityActivity.uuid);

    if (!exists) {
      const data: CommunityActivities[] = [];
      data.push(communityActivity);

      return this.esService.helpers.bulk({
        datasource: data,
        onDocument(doc) {
          return {
            index: {
              _index: EsIndex.COMMUNITY_ACTIVITIES_INDEX,
              _id: doc.uuid,
            },
          };
        },
      });
    }
  }

  async search(
    query: string,
    prevSort?: SortResults,
  ): Promise<Record<string, any>> {
    const exists = await this.esService.indices.exists({
      index: EsIndex.COMMUNITY_ACTIVITIES_INDEX,
    });

    if (!exists) return null;

    const pit = await this.esService.openPointInTime({
      index: EsIndex.COMMUNITY_ACTIVITIES_INDEX,
      keep_alive: '1m',
    });

    let hits: SearchResponse<
      CommunityActivitySearchResultDTO,
      Record<string, AggregationsAggregate>
    >;

    if (prevSort && prevSort.length > 0) {
      hits = await this.nextPage(query, prevSort, pit.id);
    } else {
      hits = await this.initSearch(query, pit);
    }

    const { hits: data } = hits;
    return { data: data.hits, total: data.hits.length };
  }

  async update(
    communityActivity: CommunityActivities,
  ): Promise<Record<string, any>> {
    const exists: boolean = await this.checkIndexExists(communityActivity.uuid);

    if (!exists) return null;

    const payload: CommunityActivities = { ...communityActivity };
    const data: CommunityActivities[] = [];
    data.push(payload);

    return this.esService.helpers.bulk({
      datasource: data,
      onDocument(doc) {
        return [
          {
            update: {
              _index: EsIndex.COMMUNITY_ACTIVITIES_INDEX,
              _id: doc.uuid,
            },
          },
          { doc_as_upsert: false },
        ];
      },
    });
  }

  async remove(uuid: string): Promise<void> {
    const exists: boolean = await this.checkIndexExists(uuid);

    if (!exists) return null;

    await this.esService.deleteByQuery({
      index: EsIndex.COMMUNITY_ACTIVITIES_INDEX,
      body: {
        query: { match: { uuid } },
      },
    });
  }

  // Check index in elasticsearch
  private async checkIndexExists(id: string): Promise<boolean> {
    return await this.esService.exists({
      index: EsIndex.COMMUNITY_ACTIVITIES_INDEX,
      id,
    });
  }

  private async initSearch(query: string, pit: OpenPointInTimeResponse) {
    return await this.esService.search<CommunityActivitySearchResultDTO>({
      size: this.resultSize,
      query: {
        multi_match: {
          query,
          fields: ['title', 'description'],
          fuzziness: 'AUTO'
        },
      },
      pit: {
        id: pit.id,
        keep_alive: '1m',
      },
      sort: [{ _score: { order: 'desc' } }, { _shard_doc: 'desc' }],
      track_total_hits: false,
    });
  }

  private async nextPage(query: string, prevSort: SortResults, pitId: string) {
    return await this.esService.search<CommunityActivitySearchResultDTO>({
      size: this.resultSize,
      query: {
        multi_match: {
          query,
          fields: ['title', 'description'],
          fuzziness: 'AUTO'
        },
      },
      pit: {
        id: pitId,
        keep_alive: '1m',
      },
      sort: [{ _score: { order: 'desc' } }, { _shard_doc: 'desc' }],
      search_after: prevSort,
      track_total_hits: false,
    });
  }
}
