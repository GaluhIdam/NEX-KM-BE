import { Test, TestingModule } from '@nestjs/testing';
import { GetFileController } from './get-file.controller';

describe('GetFileController', () => {
  let controller: GetFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetFileController],
    }).compile();

    controller = module.get<GetFileController>(GetFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
