import { EsIndex } from 'src/core/enums';
import { AlbumSearchResultDTO } from '../dtos/album.dto';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Album } from '@prisma/clients/nex-library';
import {
  AggregationsAggregate,
  OpenPointInTimeResponse,
  SearchResponse,
  SortResults,
} from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class AlbumsearchService {
  private readonly resultSize: number = 6;

  constructor(private readonly esService: ElasticsearchService) { }

  async indexAlbum(album: Album): Promise<Record<string, any>> {
    const exists: boolean = await this.checkIndexExists(album.uuid);

    if (!exists) {
      const data: Album[] = [];
      data.push(album);

      const indexed = this.esService.helpers.bulk({
        datasource: data,
        onDocument(doc) {
          return {
            index: { _index: EsIndex.ALBUMS_INDEX, _id: doc.uuid },
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
      index: EsIndex.ALBUMS_INDEX,
    });

    if (!exists) return null;

    const pit = await this.esService.openPointInTime({
      index: EsIndex.ALBUMS_INDEX,
      keep_alive: '1m',
    });

    let hits: SearchResponse<
      AlbumSearchResultDTO,
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

  async update(album: Album): Promise<Record<string, any>> {
    const exists: boolean = await this.checkIndexExists(album.uuid);

    if (!exists) return null;

    const payload: Album = { ...album };
    const data: Album[] = [];
    data.push(payload);

    return this.esService.helpers.bulk({
      datasource: data,
      onDocument(doc) {
        return [
          {
            update: {
              _index: EsIndex.ALBUMS_INDEX,
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
      index: EsIndex.ALBUMS_INDEX,
      body: {
        query: { match: { uuid } },
      },
    });
  }

  // Check index in elasticsearch
  private async checkIndexExists(id: string): Promise<boolean> {
    return await this.esService.exists({
      index: EsIndex.ALBUMS_INDEX,
      id,
    });
  }

  private async initSearch(query: string, pit: OpenPointInTimeResponse) {
    return await this.esService.search<AlbumSearchResultDTO>({
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
    return await this.esService.search<AlbumSearchResultDTO>({
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
