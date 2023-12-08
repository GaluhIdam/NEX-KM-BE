import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Merchandise } from '@prisma/clients/nex-level';
import { MerchandiseSearchResultDTO } from '../dtos/merchandise.dto';
import { EsIndex } from 'src/core/enums';
import {
  AggregationsAggregate,
  OpenPointInTimeResponse,
  SearchResponse,
  SortResults,
} from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class MerchandiseSearchService {
  private readonly resultSize: number = 6;

  constructor(private readonly esService: ElasticsearchService) { }

  async indexMerchandise(
    merchandise: Merchandise,
  ): Promise<Record<string, any>> {
    const exists: boolean = await this.checkIndexExists(merchandise.uuid);

    if (!exists) {
      const data = [];
      data.push(merchandise);

      const indexed = this.esService.helpers.bulk({
        datasource: data,
        onDocument(doc) {
          return {
            index: { _index: EsIndex.MERCH_INDEX, _id: doc.uuid },
          };
        },
        onDrop(doc) {
          console.error('docError: ', doc);
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
      index: EsIndex.MERCH_INDEX,
    });

    if (!exists) return null;

    const pit = await this.esService.openPointInTime({
      index: EsIndex.MERCH_INDEX,
      keep_alive: '1m',
    });

    let hits: SearchResponse<
      MerchandiseSearchResultDTO,
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

  async update(merchandise: Merchandise): Promise<Record<string, any>> {
    const exists: boolean = await this.checkIndexExists(merchandise.uuid);

    if (!exists) return null;

    const payload: Merchandise = { ...merchandise };
    const data: Merchandise[] = [];
    data.push(payload);

    return this.esService.helpers.bulk({
      datasource: data,
      onDocument(doc) {
        return [
          { update: { _index: EsIndex.MERCH_INDEX, _id: doc.uuid } },
          { doc_as_upsert: false },
        ];
      },
    });
  }

  async remove(uuid: string): Promise<void> {
    const exists: boolean = await this.checkIndexExists(uuid);

    if (!exists) return null;

    await this.esService.deleteByQuery({
      index: EsIndex.MERCH_INDEX,
      body: {
        query: { match: { uuid } },
      },
    });
  }

  // Check index in elasticsearch
  private async checkIndexExists(id: string): Promise<boolean> {
    return await this.esService.exists({
      index: EsIndex.MERCH_INDEX,
      id,
    });
  }

  private async initSearch(query: string, pit: OpenPointInTimeResponse) {
    return await this.esService.search<MerchandiseSearchResultDTO>({
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

  private async nextPage(query: string, lastSort: SortResults, pitId: string) {
    return await this.esService.search<MerchandiseSearchResultDTO>({
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
      search_after: lastSort,
      track_total_hits: false,
    });
  }
}
