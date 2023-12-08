import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EsIndex } from 'src/core/enums';
import { ForumSearchResultDTO } from '../dtos/forum.dto';
import { Forum } from '@prisma/clients/nex-talk';
import {
  AggregationsAggregate,
  OpenPointInTimeResponse,
  SearchResponse,
  SortResults,
} from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class ForumsearchService {
  private readonly resultSize: number = 6;

  constructor(private readonly esService: ElasticsearchService) { }

  async indexForum(forum: Forum): Promise<Record<string, any>> {
    const exists: boolean = await this.checkIndexExists(forum.uuid);

    if (!exists) {
      const data: Forum[] = [];
      data.push(forum);

      const indexed = this.esService.helpers.bulk({
        datasource: data,
        onDocument(doc) {
          return {
            index: { _index: EsIndex.FORUMS_INDEX, _id: doc.uuid },
          };
        },
        onDrop(doc) {
          console.log('docError: ', doc);
          indexed.abort();
          throw doc.error;
        },
      });

      return indexed;
    }
  }

  async search(
    query: string,
    lastSort?: SortResults,
  ): Promise<Record<string, any>> {
    const exists = await this.esService.indices.exists({
      index: EsIndex.FORUMS_INDEX,
    });

    if (!exists) return null;

    const pit = await this.esService.openPointInTime({
      index: EsIndex.FORUMS_INDEX,
      keep_alive: '1m',
    });

    let hits: SearchResponse<
      ForumSearchResultDTO,
      Record<string, AggregationsAggregate>
    >;

    if (lastSort && lastSort.length > 0) {
      hits = await this.nextPage(query, lastSort, pit.id);
    } else {
      hits = await this.initSearch(query, pit);
    }

    const { hits: data } = hits;
    return { data: data.hits, total: data.hits.length };
  }

  async update(forum: Forum): Promise<Record<string, any>> {
    const exists: boolean = await this.checkIndexExists(forum.uuid);

    if (!exists) return null;

    const payload: Forum = { ...forum };
    const data: Forum[] = [];
    data.push(payload);

    const updated = this.esService.helpers.bulk({
      datasource: data,
      onDocument(doc) {
        return [
          {
            update: {
              _index: EsIndex.FORUMS_INDEX,
              _id: doc.uuid,
            },
          },
          { doc_as_upsert: false },
        ];
      },
      onDrop(doc) {
        updated.abort();
        console.log('docError: ', doc);
        throw doc.error;
      },
    });

    return updated;
  }

  async remove(uuid: string): Promise<void> {
    const exists: boolean = await this.checkIndexExists(uuid);

    if (!exists) return null;

    const deleted = await this.esService.deleteByQuery({
      index: EsIndex.FORUMS_INDEX,
      body: {
        query: { match: { uuid } },
      },
    });

    if (deleted.failures.length > 0) {
      throw deleted.failures;
    }
  }

  // Check index in elasticsearch
  private async checkIndexExists(id: string): Promise<boolean> {
    return await this.esService.exists({
      index: EsIndex.FORUMS_INDEX,
      id,
    });
  }

  private async initSearch(query: string, pit: OpenPointInTimeResponse) {
    return await this.esService.search<ForumSearchResultDTO>({
      size: this.resultSize,
      query: {
        multi_match: {
          query,
          fields: ['title', 'description', 'createdBy', 'talkCategory.name'],
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

  private async nextPage(query: string, lastSort: SortResults, pitId: string) {
    return await this.esService.search<ForumSearchResultDTO>({
      size: this.resultSize,
      query: {
        multi_match: {
          query,
          fields: ['title', 'description', 'createdBy', 'talkCategory.name'],
          fuzziness: 'AUTO'
        },
      },
      pit: {
        id: pitId,
        keep_alive: '1m',
      },
      sort: [{ _score: { order: 'desc' } }, { _shard_doc: 'desc' }],
      search_after: lastSort,
      track_total_hits: false,
    });
  }
}
