import { SortResults } from '@elastic/elasticsearch/lib/api/types';
import { CommunityActivityDTO } from 'src/modules/nex-community/community-activity/dtos/community-activity.dto';
import { CommunityPublishDTO } from 'src/modules/nex-community/community/dtos/community.dto';
import { ArticleDTO } from 'src/modules/nex-learning/articles/dtos/article.dto';
import { GetMerchDTO } from 'src/modules/nex-level/merchandise/dtos/merchandise.dto';
import { AlbumDTO } from 'src/modules/nex-library/album/dtos/album.dto';
import { EbookDTO } from 'src/modules/nex-library/ebook/dtos/ebook.dto';
import { WebDirectoryDTO } from 'src/modules/nex-library/web-directory/dtos/web-directory.dto';
import { ForumDTO } from 'src/modules/nex-talk/forum/dtos/forum.dto';
import { PodcastDTO } from 'src/modules/nex-talk/podcast/dtos/podcast.dto';
import { StreamDTO } from 'src/modules/nex-talk/stream/dtos/stream.dto';

export class LastSortDTO {
  lastSortCommunity: SortResults;
  lastSortCommunityActivity: SortResults;
  lastSortArticle: SortResults;
  lastSortMerch: SortResults;
  lastSortAlbum: SortResults;
  lastSortEbook: SortResults;
  lastSortWebdir: SortResults;
  lastSortForum: SortResults;
  lastSortPodcast: SortResults;
  lastSortStream: SortResults;
}

export class GlobalSearchResultDTO {
  message: string;
  result: {
    community?: CommunityResultDTO;
    communityActivity?: CommunityActivityResultDTO;
    article?: ArticleResultDTO;
    merchandise?: MerchandiseResultDTO;
    album?: AlbumResultDTO;
    ebook?: EbookResultDTO;
    webDir?: WebdirResultDTO;
    forum?: ForumResultDTO;
    podcast?: PodcastResultDTO;
    stream?: StreamResultDTO;
  };
}

export class CommunityResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: CommunityPublishDTO;
    sort: [];
  }>;
  total: number;
}

export class CommunityActivityResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: CommunityActivityDTO;
    sort: [];
  }>;
  total: number;
}

export class ArticleResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: ArticleDTO;
    sort: [];
  }>;
  total: number;
}

export class MerchandiseResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: GetMerchDTO;
    sort: [];
  }>;
  total: number;
}

export class AlbumResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: AlbumDTO;
    sort: [];
  }>;
  total: number;
}

export class EbookResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: EbookDTO;
    sort: [];
  }>;
  total: number;
}

export class WebdirResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: WebDirectoryDTO;
    sort: [];
  }>;
  total: number;
}

export class ForumResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: ForumDTO;
    sort: [];
  }>;
  total: number;
}

export class PodcastResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: PodcastDTO;
    sort: [];
  }>;
  total: number;
}

export class StreamResultDTO {
  data: Array<{
    _index: string;
    _id: string;
    _score: number;
    _source: StreamDTO;
    sort: [];
  }>;
  total: number;
}

export class TopKeywordDTO {
  name: string;
  date: string
}

export class BucketItemDTO {
  key: string;
  doc_count: number;
}
