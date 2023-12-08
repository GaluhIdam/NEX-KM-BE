import { Module } from '@nestjs/common';
import { LearningFuseService } from './learning.fuse.service';
import { LearningFuseController } from './learning.fuse.controller';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';

@Module({
    providers: [LearningFuseService, PrismaLearningService],
    controllers: [LearningFuseController],
})
export class LearningFuseModule {}
