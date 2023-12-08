import { Module } from '@nestjs/common';

import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { EbookCategoryService } from './services/ebook-category.service';
import { EbookCategoryController } from './controllers/ebook-category.controller';
import { EbookService } from './services/ebook.service';
import { EbookController } from './controllers/ebook.controller';
import { EbookReviewController } from './controllers/ebook-review.controller';
import { EbookReviewService } from './services/ebook-review.service';
import { EbookCollectionReadService } from './services/ebook-collection-read.service';
import { EbookCollectionReadController } from './controllers/ebook-collection-read.controller';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';
import { EbookSearchService } from './services/ebook-search.service';

@Module({
  imports: [ElasticModule],
  controllers: [
    EbookCategoryController,
    EbookController,
    EbookReviewController,
    EbookCollectionReadController,
  ],
  providers: [
    PrismaLibraryService,
    EbookCategoryService,
    EbookService,
    EbookReviewService,
    EbookCollectionReadService,
    EbookSearchService,
  ],
})
export class EbookModule { }
