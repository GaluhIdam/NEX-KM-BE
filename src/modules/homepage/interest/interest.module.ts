import { Module } from '@nestjs/common';
import { InterestService } from './services/interest.service';
import { InterestController } from './controllers/interest.controller';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
  controllers: [InterestController],
  providers: [InterestService, PrismaHomepageService],
})
export class InterestModule {}
