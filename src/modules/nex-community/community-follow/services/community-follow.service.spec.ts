import { Test, TestingModule } from '@nestjs/testing';
import { CommunityFollowService } from './community-follow.service';

describe('CommunityFollowService', () => {
  let service: CommunityFollowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityFollowService],
    }).compile();

    service = module.get<CommunityFollowService>(CommunityFollowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
