import { Test, TestingModule } from '@nestjs/testing';
import { BestPracticeController } from './best-practice.controller';

describe('BestPracticeController', () => {
  let controller: BestPracticeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BestPracticeController],
    }).compile();

    controller = module.get<BestPracticeController>(BestPracticeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
