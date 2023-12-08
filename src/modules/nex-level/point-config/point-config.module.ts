import { Module } from '@nestjs/common';
import { PointConfigService } from './services/point-config.service';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';
import { PointConfigController } from './controllers/point-config.controller';

@Module({
  providers: [PointConfigService, PrismaLevelService],
  controllers: [PointConfigController],
})
export class PointConfigModule {}
