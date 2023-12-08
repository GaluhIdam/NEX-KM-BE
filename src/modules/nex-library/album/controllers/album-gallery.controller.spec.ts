import { Test, TestingModule } from '@nestjs/testing';
import { AlbumGalleryController } from './album-gallery.controller';

describe('AlbumGalleryController', () => {
  let controller: AlbumGalleryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumGalleryController],
    }).compile();

    controller = module.get<AlbumGalleryController>(AlbumGalleryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
