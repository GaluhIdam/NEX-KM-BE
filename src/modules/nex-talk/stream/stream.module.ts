import { PrismaTalkService } from './../../../core/services/prisma-nex-talk.service';
import { Module } from '@nestjs/common';
import { StreamController } from './controllers/stream.controller';
import { StreamService } from './services/stream.service';
import { VideoUploadModule } from 'src/core/utility/video-upload/video-upload.module';
import { BullModule } from '@nestjs/bull';
import { TalkCategoryService } from '../podcast/services/talk-category.service';
import { TalkCategoryController } from '../podcast/controllers/talk-category.controller';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';
import { StreamsearchService } from './services/stream-search.service';

@Module({
  imports: [
    VideoUploadModule,
    BullModule.registerQueue({
      name: 'video-upload',
    }),
    ElasticModule,
  ],
  controllers: [StreamController, TalkCategoryController],
  providers: [
    StreamService,
    PrismaTalkService,
    TalkCategoryService,
    StreamsearchService,
  ],
})
export class StreamModule { }
