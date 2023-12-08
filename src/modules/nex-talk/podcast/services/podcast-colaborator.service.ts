import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { Colaborator } from '@prisma/clients/nex-talk';
import { PodcastColaboratorDTO } from '../dtos/podcast-colaborator.dto';
import { PodcastColaboratorServiceInterface } from '../interfaces/podcast-colaborator.service.interface';

@Injectable()
export class PodcastColaboratorService
    extends AppError
    implements PodcastColaboratorServiceInterface
{
    constructor(private readonly prisma: PrismaTalkService) {
        super(PodcastColaboratorService.name);
    }

    //Create Podcast Colaborator
    async createPodcastColaborator(
        dto: PodcastColaboratorDTO,
    ): Promise<Colaborator> {
        const findPodcastData = await this.prisma.podcast.findFirst({
            where: {
                id: dto.podcastId,
            },
        });

        this.handlingErrorNotFound(findPodcastData, dto.podcastId, 'Podcast');
        const colaborator = await this.prisma.colaborator.create({
            data: {
                podcastId: dto.podcastId,
                personalNumber: dto.personalNumber,
            },
        });

        return colaborator;
    }

    //Update Podcast Colaborator
    async updatePodcastColaborator(
        uuid: string,
        dto: PodcastColaboratorDTO,
    ): Promise<Colaborator> {
        const findColaboratorData = await this.prisma.colaborator.findFirst({
            where: {
                uuid: uuid,
            },
        });

        this.handlingErrorNotFound(findColaboratorData, uuid, 'Colaborator');

        const colaborator = await this.prisma.colaborator.update({
            where: {
                uuid: uuid,
            },
            data: {
                podcastId: dto.podcastId,
                personalNumber: dto.personalNumber,
            },
        });

        return colaborator;
    }

    //Delete Podcast Colaborator
    async deletePodcastColaborator(uuid: string): Promise<Colaborator> {
        const findColaboratorData = await this.prisma.colaborator.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findColaboratorData, uuid, 'Colaborator');

        const deleted = await this.prisma.colaborator.delete({
            where: {
                uuid: uuid,
            },
        });

        return deleted;
    }
}
