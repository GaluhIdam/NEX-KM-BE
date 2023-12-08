import { Module } from '@nestjs/common';
import { ForYourPageService } from './services/for-your-page.service';
import { ForYourPageController } from './controllers/for-your-page.controller';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
  providers: [ForYourPageService, PrismaHomepageService],
  controllers: [ForYourPageController]
})
export class ForYourPageModule {}
