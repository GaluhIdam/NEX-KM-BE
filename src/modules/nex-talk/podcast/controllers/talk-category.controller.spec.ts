import { Test, TestingModule } from '@nestjs/testing';
import { TalkCategoryController } from './talk-category.controller';

describe('TalkCategoryController', () => {
  let controller: TalkCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalkCategoryController],
    }).compile();

    controller = module.get<TalkCategoryController>(TalkCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
