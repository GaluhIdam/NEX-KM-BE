import { Test, TestingModule } from '@nestjs/testing';
import { MilesController } from './miles.controller';

describe('MilesController', () => {
  let controller: MilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MilesController],
    }).compile();

    controller = module.get<MilesController>(MilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
