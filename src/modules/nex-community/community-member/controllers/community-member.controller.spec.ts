import { Test, TestingModule } from '@nestjs/testing';
import { CommunityMemberController } from './community-member.controller';

describe('CommunityMemberController', () => {
  let controller: CommunityMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityMemberController],
    }).compile();

    controller = module.get<CommunityMemberController>(CommunityMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
