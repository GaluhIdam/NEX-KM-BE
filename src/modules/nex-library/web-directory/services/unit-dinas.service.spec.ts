import { Test, TestingModule } from '@nestjs/testing';
import { UnitDinasService } from './unit-dinas.service';

describe('UnitDinasService', () => {
  let service: UnitDinasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitDinasService],
    }).compile();

    service = module.get<UnitDinasService>(UnitDinasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
