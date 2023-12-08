import { Test, TestingModule } from '@nestjs/testing';
import { CommunityFuseController } from './community-fuse.controller';

describe('CommunityFuseController', () => {
  let controller: CommunityFuseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityFuseController],
    }).compile();

    controller = module.get<CommunityFuseController>(CommunityFuseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
