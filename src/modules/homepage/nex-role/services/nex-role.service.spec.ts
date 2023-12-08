import { Test, TestingModule } from '@nestjs/testing';
import { NexRoleService } from './nex-role.service';

describe('NexRoleService', () => {
  let service: NexRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NexRoleService],
    }).compile();

    service = module.get<NexRoleService>(NexRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
