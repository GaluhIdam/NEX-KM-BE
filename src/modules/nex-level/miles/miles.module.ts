import { Module } from '@nestjs/common';
import { MilesService } from './services/miles.service';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';
import { MilesController } from './controllers/miles.controller';

@Module({
  providers: [MilesService, PrismaLevelService],
  controllers: [MilesController],
})
export class MilesModule {}
