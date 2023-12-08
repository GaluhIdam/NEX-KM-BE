import { Test, TestingModule } from '@nestjs/testing';
import { SharingExpService } from './sharing-exp.service';

describe('SharingExpService', () => {
  let service: SharingExpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharingExpService],
    }).compile();

    service = module.get<SharingExpService>(SharingExpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
