import { Test, TestingModule } from '@nestjs/testing';
import { CommunityActivityCommentController } from './community-activity-comment.controller';

describe('CommunityActivityCommentController', () => {
  let controller: CommunityActivityCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityActivityCommentController],
    }).compile();

    controller = module.get<CommunityActivityCommentController>(CommunityActivityCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
