import { Test, TestingModule } from '@nestjs/testing';
import { MerchandiseController } from './merchandise.controller';

describe('MerchandiseController', () => {
  let controller: MerchandiseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchandiseController],
    }).compile();

    controller = module.get<MerchandiseController>(MerchandiseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
