import { Test, TestingModule } from '@nestjs/testing';
import { CommunityActivityCommentService } from './community-activity-comment.service';

describe('CommunityActivityCommentService', () => {
  let service: CommunityActivityCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityActivityCommentService],
    }).compile();

    service = module.get<CommunityActivityCommentService>(CommunityActivityCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
