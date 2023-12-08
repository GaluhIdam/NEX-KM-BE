import { Module } from '@nestjs/common';
import { MerchandiseService } from './services/merchandise.service';
import { PrismaLevelService } from 'src/core/services/prisma-nex-level.service';
import { MerchandiseController } from './controllers/merchandise.controller';
import { MerchandiseSearchService } from './services/merchandise-search.service';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';

@Module({
  providers: [MerchandiseService, PrismaLevelService, MerchandiseSearchService],
  controllers: [MerchandiseController],
  imports: [ElasticModule],
})
export class MerchandiseModule { }
