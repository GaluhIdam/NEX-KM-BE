import { Module } from '@nestjs/common';
import { CommunityService } from './services/community.service';
import { CommunityController } from './controllers/community.controller';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';
import { CommunitysearchService } from './services/community-search.service';
import { CommunityFuseService } from '../fuse/community-fuse.service';

@Module({
  imports: [ElasticModule],
  providers: [CommunityService, PrismaCommunityService, CommunitysearchService, CommunityFuseService],
  controllers: [CommunityController],
})
export class CommunityModule { }
