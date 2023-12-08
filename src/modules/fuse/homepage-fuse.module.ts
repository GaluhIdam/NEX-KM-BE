import { Module } from '@nestjs/common';
import { HomepageFuseService } from './homepage-fuse.service';
import { HomepageFuseController } from './homepage-fuse.controller';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';

@Module({
    providers: [
        HomepageFuseService,
        PrismaCommunityService,
        PrismaLearningService,
    ],
    controllers: [HomepageFuseController],
})
export class HomepageFuseModule {}
