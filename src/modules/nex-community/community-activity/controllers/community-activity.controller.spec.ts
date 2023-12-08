import { Test, TestingModule } from '@nestjs/testing';
import { CommunityActivityController } from './community-activity.controller';

describe('CommunityActivityController', () => {
  let controller: CommunityActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityActivityController],
    }).compile();

    controller = module.get<CommunityActivityController>(
      CommunityActivityController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
