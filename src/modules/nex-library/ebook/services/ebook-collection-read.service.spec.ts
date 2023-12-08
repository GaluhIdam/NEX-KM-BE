import { Test, TestingModule } from '@nestjs/testing';
import { EbookCollectionService } from './ebook-collection-read.service';

describe('EbookCollectionService', () => {
  let service: EbookCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EbookCollectionService],
    }).compile();

    service = module.get<EbookCollectionService>(EbookCollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
