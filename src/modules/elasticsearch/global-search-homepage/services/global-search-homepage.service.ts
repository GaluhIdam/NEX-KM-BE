import { Injectable, Logger } from '@nestjs/common';
import { GlobalSearchHomepageServiceInterface } from '../interfaces';
import { BucketItemDTO, GlobalSearchResultDTO, LastSortDTO, TopKeywordDTO } from '../dtos/global-search.dto';
import { CommunitysearchService } from 'src/modules/nex-community/community/services/community-search.service';
import { CommunityActivitysearchService } from 'src/modules/nex-community/community-activity/services/community-activity-search.service';
import { ArticlesearchService } from 'src/modules/nex-learning/articles/services/articlesearch.service';
import { MerchandiseSearchService } from 'src/modules/nex-level/merchandise/services/merchandise-search.service';
import { AlbumsearchService } from 'src/modules/nex-library/album/services/album-search.service';
import { WebdirsearchService } from 'src/modules/nex-library/web-directory/services/webdir-search.service';
import { ForumsearchService } from 'src/modules/nex-talk/forum/services/forum-search.service';
import { PodcastsearchService } from 'src/modules/nex-talk/podcast/services/podcast-search.service';
import { StreamsearchService } from 'src/modules/nex-talk/stream/services/stream-search.service';
import { EbookSearchService } from 'src/modules/nex-library/ebook/services/ebook-search.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EsIndex } from 'src/core/enums';
import { BulkStats } from '@elastic/elasticsearch/lib/helpers';

@Injectable()
export class GlobalSearchHomepageService
  implements GlobalSearchHomepageServiceInterface {
  private logger = new Logger(GlobalSearchHomepageService.name)

  constructor(
    private communitySearch: CommunitysearchService,
    private communityActivitySearch: CommunityActivitysearchService,
    private articleSearch: ArticlesearchService,
    private merchandiseSearch: MerchandiseSearchService,
    private albumSearch: AlbumsearchService,
    private ebookSearh: EbookSearchService,
    private webdirSearch: WebdirsearchService,
    private forumSearch: ForumsearchService,
    private podcastSearch: PodcastsearchService,
    private streamSearch: StreamsearchService,
    private esService: ElasticsearchService
  ) { }

  async globalSearch(
    query: string,
    lastSort: LastSortDTO,
  ): Promise<GlobalSearchResultDTO> {
    const {
      lastSortAlbum,
      lastSortArticle,
      lastSortCommunity,
      lastSortCommunityActivity,
      lastSortEbook,
      lastSortForum,
      lastSortMerch,
      lastSortPodcast,
      lastSortStream,
      lastSortWebdir,
    } = lastSort;

    const community = await this.communitySearch.search(
      query,
      lastSortCommunity,
    );
    const communityActivity = await this.communityActivitySearch.search(
      query,
      lastSortCommunityActivity,
    );
    const article = await this.articleSearch.search(query, lastSortArticle);
    const merchandise = await this.merchandiseSearch.search(
      query,
      lastSortMerch,
    );
    const album = await this.albumSearch.search(query, lastSortAlbum);
    const ebook = await this.ebookSearh.search(query, lastSortEbook);
    const webDir = await this.webdirSearch.search(query, lastSortWebdir);
    const forum = await this.forumSearch.search(query, lastSortForum);
    const podcast = await this.podcastSearch.search(query, lastSortPodcast);
    const stream = await this.streamSearch.search(query, lastSortStream);

    const result: GlobalSearchResultDTO = {
      message: 'Search successfully',
      result: {
        community: { data: community?.data, total: community.total },
        communityActivity: {
          data: communityActivity?.data,
          total: communityActivity.total,
        },
        article: { data: article?.data, total: article.total },
        merchandise: {
          data: merchandise?.data,
          total: merchandise.total,
        },
        album: { data: album?.data, total: album.total },
        ebook: { data: ebook?.data, total: ebook.total },
        webDir: { data: webDir?.data, total: webDir.total },
        forum: { data: forum?.data, total: forum.total },
        podcast: { data: podcast?.data, total: podcast.total },
        stream: { data: stream?.data, total: stream.total },
      },
    };

    const payloads = [...community?.data, ...communityActivity?.data, ...article?.data, ...merchandise?.data, ...album?.data, ...ebook?.data, ...webDir?.data, ...forum?.data, ...podcast?.data, ...stream?.data]
    const data: TopKeywordDTO[] = payloads?.map((item) => ({
      name: item._source.name ?? item._source.title,
      date: new Date().toISOString()
    }))

    await this.addKeywordToIndices(data)
    return result;
  }

  private async addKeywordToIndices(payload: TopKeywordDTO[]): Promise<BulkStats> {
    try {
      // Remove duplicate data
      const data: TopKeywordDTO[] = payload.filter((obj, index) => index === payload.findIndex(o => obj.name === o.name))

      return await this.esService.helpers.bulk({
        datasource: data,
        onDocument(doc) {
          return { index: { _index: EsIndex.TOP_KEYWORDS } }
        },
      })
    } catch (error) {
      this.logger.error(error);
      throw error
    }
  }

  async getTrendingSearch(): Promise<string[]> {
    const { aggregations } = await this.esService.search<string, any>({
      index: EsIndex.TOP_KEYWORDS,
      size: 0,
      query: {
        //for only today's news articles
        range: {
          date: {
            gt: "now-1d/d",
            lte: "now/d"
          }
        }
      },
      aggs: {
        top_keywords: {
          terms: {
            field: "name.keyword",
            size: 4,
          }
        }
      }
    })

    const { buckets } = aggregations.top_keywords
    const trendings: string[] = []
    buckets.map((item: BucketItemDTO) => item.doc_count >= 10 ? trendings.push(item.key) : '')

    return trendings;
  }
}
