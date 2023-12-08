import { Module } from '@nestjs/common';
import { CommunityFuseController } from './community-fuse.controller';
import { CommunityFuseService } from './community-fuse.service';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';

@Module({
    controllers: [CommunityFuseController],
    providers: [CommunityFuseService, PrismaCommunityService],
})
export class CommunityFuseModule {}
