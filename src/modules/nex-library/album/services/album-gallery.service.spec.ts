import { Test, TestingModule } from '@nestjs/testing';
import { AlbumGalleryService } from './album-gallery.service';

describe('AlbumGalleryService', () => {
  let service: AlbumGalleryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumGalleryService],
    }).compile();

    service = module.get<AlbumGalleryService>(AlbumGalleryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
