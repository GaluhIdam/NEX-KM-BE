import { Test, TestingModule } from '@nestjs/testing';
import { NexTeamController } from './nex-team.controller';

describe('NexTeamController', () => {
    let controller: NexTeamController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NexTeamController],
        }).compile();

        controller = module.get<NexTeamController>(NexTeamController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
