import { Test, TestingModule } from '@nestjs/testing';
import { CommunityRoleService } from './community-role.service';

describe('CommunityRoleService', () => {
  let service: CommunityRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityRoleService],
    }).compile();

    service = module.get<CommunityRoleService>(CommunityRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
