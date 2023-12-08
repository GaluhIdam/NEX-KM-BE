import { Test, TestingModule } from '@nestjs/testing';
import { PointConfigService } from './point-config.service';

describe('PointConfigService', () => {
  let service: PointConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointConfigService],
    }).compile();

    service = module.get<PointConfigService>(PointConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
