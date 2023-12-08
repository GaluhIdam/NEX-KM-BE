import { Module } from '@nestjs/common';
import { BestPracticeController } from './controllers/best-practice.controller';
import { BestPracticeService } from './services/best-practice.service';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { ForYourPageService } from 'src/modules/homepage/for-your-page/services/for-your-page.service';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
    providers: [BestPracticeService, PrismaLearningService, ForYourPageService, PrismaHomepageService],
    controllers: [BestPracticeController],
})
export class BestPracticeModule {}
