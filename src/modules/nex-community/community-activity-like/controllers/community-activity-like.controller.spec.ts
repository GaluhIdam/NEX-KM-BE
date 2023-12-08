import { Test, TestingModule } from '@nestjs/testing';
import { CommunityActivityLikeController } from './community-activity-like.controller';

describe('CommunityActivityLikeController', () => {
  let controller: CommunityActivityLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityActivityLikeController],
    }).compile();

    controller = module.get<CommunityActivityLikeController>(CommunityActivityLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
