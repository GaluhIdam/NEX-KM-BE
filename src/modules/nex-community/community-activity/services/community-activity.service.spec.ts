import { Test, TestingModule } from '@nestjs/testing';
import { CommunityActivityService } from './community-activity.service';

describe('CommunityActivityService', () => {
  let service: CommunityActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityActivityService],
    }).compile();

    service = module.get<CommunityActivityService>(CommunityActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
