import { Module, forwardRef } from '@nestjs/common';
import { PointService } from './services/point.service';
import { PointController } from './controllers/point.controller';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';

@Module({
  providers: [PointService, PrismaLevelService],
  controllers: [PointController],
  exports: [PointService],
})
export class PointModule {}
