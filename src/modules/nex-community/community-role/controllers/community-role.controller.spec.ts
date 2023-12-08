import { Test, TestingModule } from '@nestjs/testing';
import { CommunityRoleController } from './community-role.controller';

describe('CommunityRoleController', () => {
  let controller: CommunityRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityRoleController],
    }).compile();

    controller = module.get<CommunityRoleController>(CommunityRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
