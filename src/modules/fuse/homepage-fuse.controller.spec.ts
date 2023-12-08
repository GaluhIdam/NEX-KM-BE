import { Test, TestingModule } from '@nestjs/testing';
import { HomepageFuseController } from './homepage-fuse.controller';

describe('HomepageFuseController', () => {
  let controller: HomepageFuseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomepageFuseController],
    }).compile();

    controller = module.get<HomepageFuseController>(HomepageFuseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
