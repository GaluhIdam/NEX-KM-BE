import { Test, TestingModule } from '@nestjs/testing';
import { EbookCategoryService } from './ebook-category.service';

describe('EbookCategoryService', () => {
  let service: EbookCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EbookCategoryService],
    }).compile();

    service = module.get<EbookCategoryService>(EbookCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
