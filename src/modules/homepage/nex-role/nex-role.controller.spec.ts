import { Test, TestingModule } from '@nestjs/testing';
import { NexRoleController } from './nex-role.controller';

describe('NexRoleController', () => {
  let controller: NexRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NexRoleController],
    }).compile();

    controller = module.get<NexRoleController>(NexRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
