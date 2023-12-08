import { Module } from '@nestjs/common';
import { CommunityActivityLikeController } from './controllers/community-activity-like.controller';
import { CommunityActivityLikeService } from './services/community-activity-like.service';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';

@Module({
    controllers: [CommunityActivityLikeController],
    providers: [CommunityActivityLikeService, PrismaCommunityService],
})
export class CommunityActivityLikeModule {}
