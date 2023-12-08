import { Test, TestingModule } from '@nestjs/testing';
import { BestPracticeService } from './best-practice.service';

describe('BestPracticeService', () => {
  let service: BestPracticeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BestPracticeService],
    }).compile();

    service = module.get<BestPracticeService>(BestPracticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
