import { Module } from '@nestjs/common';
import { NexTeamService } from './services/nex-team.service';
import { NexTeamController } from './nex-team.controller';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
  providers: [NexTeamService, PrismaHomepageService],
  controllers: [NexTeamController],
})
export class NexTeamModule {}
