import { Module } from '@nestjs/common';
import { CommunityActivityService } from './services/community-activity.service';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { CommunityActivityController } from './controllers/community-activity.controller';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';
import { CommunityActivitysearchService } from './services/community-activity-search.service';
import { CommunityFuseService } from '../fuse/community-fuse.service';
import { ForYourPageService } from 'src/modules/homepage/for-your-page/services/for-your-page.service';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
    imports: [ElasticModule],
    providers: [
        CommunityActivityService,
        PrismaCommunityService,
        CommunityActivitysearchService,
        CommunityFuseService,
        ForYourPageService,
        PrismaHomepageService,
    ],
    controllers: [CommunityActivityController],
})
export class CommunityActivityModule {}
