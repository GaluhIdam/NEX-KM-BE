import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCategoryController } from './article-category.controller';

describe('ArticleCategoryController', () => {
  let controller: ArticleCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleCategoryController],
    }).compile();

    controller = module.get<ArticleCategoryController>(ArticleCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
