import { Module } from '@nestjs/common';
import { AlbumCategoryService } from './services/album-category.service';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { AlbumService } from './services/album.service';
import { AlbumCategoryController } from './controllers/album-category.controller';
import { AlbumController } from './controllers/album.controller';
import { AlbumGalleryController } from './controllers/album-gallery.controller';
import { AlbumGalleryService } from './services/album-gallery.service';
import { AlbumsearchService } from './services/album-search.service';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';

@Module({
  imports: [ElasticModule],
  controllers: [
    AlbumCategoryController,
    AlbumController,
    AlbumGalleryController,
  ],
  providers: [
    AlbumCategoryService,
    AlbumService,
    PrismaLibraryService,
    AlbumGalleryService,
    AlbumsearchService,
  ],
})
export class AlbumModule { }
