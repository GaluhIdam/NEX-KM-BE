import { Test, TestingModule } from '@nestjs/testing';
import { CommunityFollowController } from './community-follow.controller';

describe('CommunityFollowController', () => {
  let controller: CommunityFollowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityFollowController],
    }).compile();

    controller = module.get<CommunityFollowController>(
      CommunityFollowController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
