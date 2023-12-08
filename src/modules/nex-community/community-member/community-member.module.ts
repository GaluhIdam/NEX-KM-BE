import { Module } from '@nestjs/common';
import { CommunityMemberService } from './services/community-member.service';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { CommunityMemberController } from './controllers/community-member.controller';

@Module({
  providers: [CommunityMemberService, PrismaCommunityService],
  controllers: [CommunityMemberController],
})
export class CommunityMemberModule { }
