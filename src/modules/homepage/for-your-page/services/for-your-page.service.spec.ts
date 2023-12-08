import { Test, TestingModule } from '@nestjs/testing';
import { ForYourPageService } from './for-your-page.service';

describe('ForYourPageService', () => {
  let service: ForYourPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForYourPageService],
    }).compile();

    service = module.get<ForYourPageService>(ForYourPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
