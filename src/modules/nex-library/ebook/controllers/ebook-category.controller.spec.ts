import { Test, TestingModule } from '@nestjs/testing';
import { EbookCategoryController } from './ebook-category.controller';

describe('EbookCategoryController', () => {
  let controller: EbookCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EbookCategoryController],
    }).compile();

    controller = module.get<EbookCategoryController>(EbookCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
