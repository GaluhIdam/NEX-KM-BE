import { Test, TestingModule } from '@nestjs/testing';
import { ForYourPageController } from './for-your-page.controller';

describe('ForYourPageController', () => {
  let controller: ForYourPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForYourPageController],
    }).compile();

    controller = module.get<ForYourPageController>(ForYourPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
