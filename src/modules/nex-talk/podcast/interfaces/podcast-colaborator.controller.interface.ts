import { Response } from 'express';
import { PodcastColaboratorDTO } from '../dtos/podcast-colaborator.dto';
import { Colaborator } from '@prisma/clients/nex-talk';

export interface PodcastColaboratorControllerInterface {
    createPodcastColaborator(
        res: Response,
        dto: PodcastColaboratorDTO,
    ): Promise<Response>;

    updatePodcastColaborator(
        res: Response,
        uuid: string,
        dto: Colaborator,
    ): Promise<Response>;

    deletePodcastColaborator(res: Response, uuid: string): Promise<Response>;
}
