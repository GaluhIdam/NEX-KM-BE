import { Module } from '@nestjs/common';
import { FeedsService } from './services/feeds.service';
import { FeedsController } from './controllers/feeds.controller';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';

@Module({
  imports: [ElasticModule],
  controllers: [FeedsController],
  providers: [FeedsService]
})
export class FeedsModule { }
