import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './controllers/permission.controller';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
  providers: [PermissionService, PrismaHomepageService],
  controllers: [PermissionController]
})
export class PermissionModule {}
