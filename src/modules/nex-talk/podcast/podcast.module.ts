import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SerieService } from './services/serie.service';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { SerieController } from './controllers/serie.controller';
import { PodcastService } from './services/podcast.service';
import { PodcastController } from './controllers/podcast.controller';
import { AudioUploadModule } from 'src/core/utility/audio-upload/audio-upload.module';
import { TalkCategoryService } from './services/talk-category.service';
import { TalkCategoryController } from './controllers/talk-category.controller';
import { CreatorService } from './services/creator.service';
import { CreatorController } from './controllers/creator.controller';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';
import { PodcastsearchService } from './services/podcast-search.service';
import { PodcastColaboratorService } from './services/podcast-colaborator.service';
import { PodcastColaboratorController } from './controllers/podcast-colaborator.controller';

@Module({
    imports: [
        AudioUploadModule,
        BullModule.registerQueue({
            name: 'podcast-upload',
        }),
        ElasticModule,
    ],
    providers: [
        SerieService,
        PrismaTalkService,
        PodcastService,
        TalkCategoryService,
        CreatorService,
        PodcastsearchService,
        PodcastColaboratorService,
    ],
    controllers: [
        SerieController,
        PodcastController,
        TalkCategoryController,
        CreatorController,
        PodcastColaboratorController,
    ],
})
export class PodcastModule {}
