import { Test, TestingModule } from '@nestjs/testing';
import { HomepageFuseService } from './homepage-fuse.service';

describe('HomepageFuseService', () => {
  let service: HomepageFuseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomepageFuseService],
    }).compile();

    service = module.get<HomepageFuseService>(HomepageFuseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
