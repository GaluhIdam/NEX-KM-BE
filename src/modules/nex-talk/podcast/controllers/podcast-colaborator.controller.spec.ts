import { Test, TestingModule } from '@nestjs/testing';
import { PodcastColaboratorController } from './podcast-colaborator.controller';

describe('PodcastColaboratorController', () => {
    let controller: PodcastColaboratorController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PodcastColaboratorController],
        }).compile();

        controller = module.get<PodcastColaboratorController>(
            PodcastColaboratorController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
