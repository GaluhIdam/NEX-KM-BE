import { Module } from '@nestjs/common';
import { StoryService } from './services/story.service';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { StoryController } from './controllers/story.controller';
import { VideoUploadModule } from 'src/core/utility/video-upload/video-upload.module';
import { BullModule } from '@nestjs/bull';
import { LearningFuseService } from '../fuse/learning.fuse.service';
import { ForYourPageService } from 'src/modules/homepage/for-your-page/services/for-your-page.service';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
    imports: [
        VideoUploadModule,
        BullModule.registerQueue({
            name: 'video-upload',
        }),
    ],
    providers: [
        StoryService,
        PrismaLearningService,
        LearningFuseService,
        ForYourPageService,
        PrismaHomepageService,
    ],
    controllers: [StoryController],
})
export class StoriesModule {}
