import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchConfigService } from './config/elasticsearch.config';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      useClass: ElasticsearchConfigService,
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ElasticModule { }
