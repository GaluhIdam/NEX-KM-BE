import { Module } from '@nestjs/common';
import { UnitDinasService } from './services/unit-dinas.service';
import { UnitDinasController } from './controllers/unit-dinas.controller';
import { WebDirectoryService } from './services/web-directory.service';
import { WebDirectoryController } from './controllers/web-directory.controller';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';
import { WebdirsearchService } from './services/webdir-search.service';

@Module({
  imports: [ElasticModule],
  providers: [
    UnitDinasService,
    WebDirectoryService,
    PrismaLibraryService,
    WebdirsearchService,
  ],
  controllers: [UnitDinasController, WebDirectoryController],
})
export class WebDirectoryModule { }
