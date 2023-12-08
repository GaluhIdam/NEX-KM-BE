import { Test, TestingModule } from '@nestjs/testing';
import { PodcastColaboratorService } from './podcast-colaborator.service';

describe('PodcastColaboratorService', () => {
    let service: PodcastColaboratorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PodcastColaboratorService],
        }).compile();

        service = module.get<PodcastColaboratorService>(
            PodcastColaboratorService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
