import { Colaborator } from '@prisma/clients/nex-talk';

import { PodcastColaboratorDTO } from '../dtos/podcast-colaborator.dto';

export interface PodcastColaboratorServiceInterface {
    createPodcastColaborator(dto: PodcastColaboratorDTO): Promise<Colaborator>;

    updatePodcastColaborator(
        uuid: string,
        dto: PodcastColaboratorDTO,
    ): Promise<Colaborator>;

    deletePodcastColaborator(uuid: string): Promise<Colaborator>;
}
