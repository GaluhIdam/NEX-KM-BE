import { Test, TestingModule } from '@nestjs/testing';
import { PointConfigController } from './point-config.controller';

describe('PointConfigController', () => {
  let controller: PointConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointConfigController],
    }).compile();

    controller = module.get<PointConfigController>(PointConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
