import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, PrismaHomepageService],
})
export class NotificationModule { }
