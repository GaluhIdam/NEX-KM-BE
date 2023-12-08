import { Module } from '@nestjs/common';
import { SharingExpService } from './services/sharing-exp.service';
import { SharingExpController } from './controllers/sharing-exp.controller';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
  controllers: [SharingExpController],
  providers: [SharingExpService, PrismaHomepageService],
})
export class SharingExpModule { }
