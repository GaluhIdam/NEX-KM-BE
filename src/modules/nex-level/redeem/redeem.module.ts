import { Module } from '@nestjs/common';
import { RedeemService } from './services/redeem.service';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';
import { RedeemController } from './controllers/redeem.controller';

@Module({
  providers: [RedeemService, PrismaLevelService],
  controllers: [RedeemController],
})
export class RedeemModule {}
