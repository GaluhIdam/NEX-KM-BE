import { Module } from '@nestjs/common';
import { NexRoleService } from './services/nex-role.service';
import { NexRoleController } from './nex-role.controller';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
  providers: [NexRoleService, PrismaHomepageService],
  controllers: [NexRoleController],
})
export class NexRoleModule {}
