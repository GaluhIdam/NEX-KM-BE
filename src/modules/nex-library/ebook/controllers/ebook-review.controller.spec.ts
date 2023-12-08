import { Test, TestingModule } from '@nestjs/testing';
import { EbookReviewController } from './ebook-review.controller';

describe('EbookReviewController', () => {
  let controller: EbookReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EbookReviewController],
    }).compile();

    controller = module.get<EbookReviewController>(EbookReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
