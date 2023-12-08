import { Test, TestingModule } from '@nestjs/testing';
import { CommunityFuseService } from './community-fuse.service';

describe('CommunityFuseService', () => {
  let service: CommunityFuseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityFuseService],
    }).compile();

    service = module.get<CommunityFuseService>(CommunityFuseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
