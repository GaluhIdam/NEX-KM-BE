import { Test, TestingModule } from '@nestjs/testing';
import { AlbumCategoryController } from './album-category.controller';

describe('AlbumCategoryController', () => {
  let controller: AlbumCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumCategoryController],
    }).compile();

    controller = module.get<AlbumCategoryController>(AlbumCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
