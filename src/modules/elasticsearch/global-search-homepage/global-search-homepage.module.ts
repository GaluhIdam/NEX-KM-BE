import { Module } from '@nestjs/common';
import { GlobalSearchHomepageService } from './services/global-search-homepage.service';
import { GlobalSearchHomepageController } from './controllers/global-search-homepage.controller';
import { CommunityActivitysearchService } from 'src/modules/nex-community/community-activity/services/community-activity-search.service';
import { CommunitysearchService } from 'src/modules/nex-community/community/services/community-search.service';
import { ArticlesearchService } from 'src/modules/nex-learning/articles/services/articlesearch.service';
import { MerchandiseSearchService } from 'src/modules/nex-level/merchandise/services/merchandise-search.service';
import { AlbumsearchService } from 'src/modules/nex-library/album/services/album-search.service';
import { EbookSearchService } from 'src/modules/nex-library/ebook/services/ebook-search.service';
import { WebdirsearchService } from 'src/modules/nex-library/web-directory/services/webdir-search.service';
import { ForumsearchService } from 'src/modules/nex-talk/forum/services/forum-search.service';
import { PodcastsearchService } from 'src/modules/nex-talk/podcast/services/podcast-search.service';
import { StreamsearchService } from 'src/modules/nex-talk/stream/services/stream-search.service';
import { ElasticModule } from '../elastic/elastic.module';

@Module({
  imports: [ElasticModule],
  controllers: [GlobalSearchHomepageController],
  providers: [
    GlobalSearchHomepageService,
    CommunitysearchService,
    CommunityActivitysearchService,
    ArticlesearchService,
    MerchandiseSearchService,
    AlbumsearchService,
    EbookSearchService,
    WebdirsearchService,
    ForumsearchService,
    PodcastsearchService,
    StreamsearchService,
  ],
})
export class GlobalSearchHomepageModule { }
