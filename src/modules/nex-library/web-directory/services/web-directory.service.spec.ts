import { Test, TestingModule } from '@nestjs/testing';
import { WebDirectoryService } from './web-directory.service';

describe('WebDirectoryService', () => {
  let service: WebDirectoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebDirectoryService],
    }).compile();

    service = module.get<WebDirectoryService>(WebDirectoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
