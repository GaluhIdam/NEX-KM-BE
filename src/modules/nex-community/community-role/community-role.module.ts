import { Module } from '@nestjs/common';
import { CommunityRoleService } from './services/community-role.service';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { CommunityRoleController } from './controllers/community-role.controller';

@Module({
  providers: [CommunityRoleService, PrismaCommunityService],
  controllers: [CommunityRoleController],
})
export class CommunityRoleModule { }
