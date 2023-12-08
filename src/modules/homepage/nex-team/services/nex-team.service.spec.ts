import { Test, TestingModule } from '@nestjs/testing';
import { NexTeamService } from './nex-team.service';

describe('NexTeamService', () => {
  let service: NexTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NexTeamService],
    }).compile();

    service = module.get<NexTeamService>(NexTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
