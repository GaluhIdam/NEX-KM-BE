import { Test, TestingModule } from '@nestjs/testing';
import { CommunityMemberService } from './community-member.service';

describe('CommunityMemberService', () => {
  let service: CommunityMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityMemberService],
    }).compile();

    service = module.get<CommunityMemberService>(CommunityMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
