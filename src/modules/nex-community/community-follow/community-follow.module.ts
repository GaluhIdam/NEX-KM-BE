import { Module } from '@nestjs/common';
import { CommunityFollowService } from './services/community-follow.service';
import { CommunityFollowController } from './community-follow.controller';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';

@Module({
  providers: [CommunityFollowService, PrismaCommunityService],
  controllers: [CommunityFollowController],
})
export class CommunityFollowModule {}
