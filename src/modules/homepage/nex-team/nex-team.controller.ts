import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
} from '@nestjs/common';
import { NexTeamControllerInterface } from './interfaces/nex-team.controller.interface';
import { Response } from 'express';
import { NexTeamService } from './services/nex-team.service';
import {
    CreateNexTeamDTO,
    GetUsersQueryDTO,
    NexTeamDTO,
    UpdateNexTeamDTO,
} from './dtos';
import { BaseController } from 'src/core/controllers/base.controller';
import { ResponseDTO } from 'src/core/dtos/response.dto';

@Controller({ path: 'api/nex-team', version: '1' })
export class NexTeamController
    extends BaseController
    implements NexTeamControllerInterface
{
    constructor(private readonly nexTeamService: NexTeamService) {
        super(NexTeamController.name);
    }

    @Get()
    async showAllDataNexTeams(
        @Res() res: Response<any, Record<string, any>>,
        @Query() queryParams: GetUsersQueryDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(queryParams.page, queryParams.limit);
            const result: ResponseDTO<NexTeamDTO[]> =
                await this.nexTeamService.findFirstHundredNexTeamsData(
                    queryParams,
                );

            return res
                .status(200)
                .send(this.responseMessage('Nex teams', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Post()
    async createNexTeam(
        @Res() res: Response<any, Record<string, any>>,
        @Body() data: CreateNexTeamDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result: NexTeamDTO =
                await this.nexTeamService.createNexTeamData(data);

            return res
                .status(201)
                .send(this.responseMessage('Nex team', 'Create', 201, result));
        } catch (error) {
            throw error;
        }
    }

    @Delete('/:uuid')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteNexTeamByUUID(@Param('uuid') uuid: string): Promise<void> {
        try {
            await this.nexTeamService.deleteNexTeamDataByUUID(uuid);
        } catch (error) {
            throw error;
        }
    }

    @Put('/:personnelNumber')
    async updateNexTeamByPersonnelNumber(
        @Res() res: Response<any, Record<string, any>>,
        @Body() data: UpdateNexTeamDTO,
        @Param('personnelNumber') personnelNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result: NexTeamDTO =
                await this.nexTeamService.updateNexTeamDataByPersonnelNumber(
                    data,
                    personnelNumber,
                );

            return res
                .status(200)
                .send(this.responseMessage('Nex team', 'Update', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Get('/detail/:personnelNumber')
    async detailNexTeamUsingPersonnelNumber(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personnelNumber') personnelNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result: NexTeamDTO =
                await this.nexTeamService.findNexTeamByPersonnelNumber(
                    personnelNumber,
                );

            return res
                .status(200)
                .send(this.responseMessage('Nex team', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Get('/detail-team/:uuid')
    async detailNexTeamUsingUUID(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result: NexTeamDTO =
                await this.nexTeamService.findNexTeamByUUID(uuid);

            return res
                .status(200)
                .send(this.responseMessage('Nex team', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }
}
