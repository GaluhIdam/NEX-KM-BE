import { Module } from '@nestjs/common';
import { RolePermissionController } from './controllers/role-permission.controller';
import { RolePermissionService } from './services/role-permission.service';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
  controllers: [RolePermissionController],
  providers: [RolePermissionService, PrismaHomepageService]
})
export class RolePermissionModule {}
