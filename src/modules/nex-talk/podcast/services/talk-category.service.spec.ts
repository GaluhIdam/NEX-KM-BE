import { Test, TestingModule } from '@nestjs/testing';
import { TalkCategoryService } from './talk-category.service';

describe('TalkCategoryService', () => {
  let service: TalkCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalkCategoryService],
    }).compile();

    service = module.get<TalkCategoryService>(TalkCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
