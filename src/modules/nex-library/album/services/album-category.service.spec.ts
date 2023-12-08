import { Test, TestingModule } from '@nestjs/testing';
import { AlbumCategoryService } from './album-category.service';

describe('AlbumCategoryService', () => {
  let service: AlbumCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumCategoryService],
    }).compile();

    service = module.get<AlbumCategoryService>(AlbumCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
