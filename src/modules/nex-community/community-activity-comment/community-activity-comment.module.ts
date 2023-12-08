import { Module } from '@nestjs/common';
import { CommunityActivityCommentService } from './services/community-activity-comment.service';
import { CommunityActivityCommentController } from './controllers/community-activity-comment.controller';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';

@Module({
    providers: [CommunityActivityCommentService, PrismaCommunityService],
    controllers: [CommunityActivityCommentController],
})
export class CommunityActivityCommentModule {}
