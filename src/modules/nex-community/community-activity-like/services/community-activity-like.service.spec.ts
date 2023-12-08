import { Test, TestingModule } from '@nestjs/testing';
import { CommunityActivityLikeService } from './community-activity-like.service';

describe('CommunityActivityLikeService', () => {
  let service: CommunityActivityLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityActivityLikeService],
    }).compile();

    service = module.get<CommunityActivityLikeService>(CommunityActivityLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
