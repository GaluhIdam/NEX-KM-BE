import { Module } from '@nestjs/common';
import { SliderService } from './services/slider.service';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import { SliderController } from './controllers/slider.controller';

@Module({
  providers: [SliderService, PrismaHomepageService],
  controllers: [SliderController],
})
export class SliderModule {}
