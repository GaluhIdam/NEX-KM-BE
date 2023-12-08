import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    Put,
    Res,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { Response } from 'express';
import { PodcastColaboratorDTO } from '../dtos/podcast-colaborator.dto';
import { PodcastColaboratorService } from '../services/podcast-colaborator.service';
import { PodcastColaboratorControllerInterface } from '../interfaces/podcast-colaborator.controller.interface';

@Controller({ path: 'api/podcast/colaborator', version: '1' })
export class PodcastColaboratorController
    extends BaseController
    implements PodcastColaboratorControllerInterface
{
    constructor(
        private readonly podcastColaboratorService: PodcastColaboratorService,
    ) {
        super(PodcastColaboratorController.name);
    }

    //Create Podcast Colaborator
    @Post()
    async createPodcastColaborator(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: PodcastColaboratorDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.podcastColaboratorService.createPodcastColaborator(
                    dto,
                );

            return res
                .status(201)
                .send(
                    this.responseMessage('Colaborator', 'Create', 201, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Update Podcast
    @Put('/:uuid')
    async updatePodcastColaborator(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: PodcastColaboratorDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.podcastColaboratorService.updatePodcastColaborator(
                    uuid,
                    dto,
                );

            return res
                .status(200)
                .send(
                    this.responseMessage('Colaborator', 'Update', 200, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Delete Podcast
    @Delete('/:uuid')
    async deletePodcastColaborator(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result =
                await this.podcastColaboratorService.deletePodcastColaborator(
                    uuid,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage('Colaborator', 'Delete', 200, result),
                );
        } catch (error) {
            throw error;
        }
    }
}
