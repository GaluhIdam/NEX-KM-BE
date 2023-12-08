import { Test, TestingModule } from '@nestjs/testing';
import { UnitDinasController } from './unit-dinas.controller';

describe('UnitDinasController', () => {
  let controller: UnitDinasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitDinasController],
    }).compile();

    controller = module.get<UnitDinasController>(UnitDinasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
