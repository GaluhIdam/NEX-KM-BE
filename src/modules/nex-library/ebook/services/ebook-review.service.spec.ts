import { Test, TestingModule } from '@nestjs/testing';
import { EbookReviewService } from './ebook-review.service';

describe('EbookReviewService', () => {
  let service: EbookReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EbookReviewService],
    }).compile();

    service = module.get<EbookReviewService>(EbookReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
