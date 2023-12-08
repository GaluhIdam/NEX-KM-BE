import { Test, TestingModule } from '@nestjs/testing';
import { WebDirectoryController } from './web-directory.controller';

describe('WebDirectoryController', () => {
  let controller: WebDirectoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebDirectoryController],
    }).compile();

    controller = module.get<WebDirectoryController>(WebDirectoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
