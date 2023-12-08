import { Response } from 'express';
import { CreateNexTeamDTO, GetUsersQueryDTO, UpdateNexTeamDTO } from '../dtos';

export interface NexTeamControllerInterface {
    showAllDataNexTeams(
        res: Response,
        query: GetUsersQueryDTO,
    ): Promise<Response>;

    /**
     *
     * @param res @Res
     * @param data @Body
     */
    createNexTeam(res: Response, data: CreateNexTeamDTO): Promise<Response>;

    deleteNexTeamByUUID(uuid: string): Promise<void>;

    updateNexTeamByPersonnelNumber(
        res: Response,
        data: UpdateNexTeamDTO,
        uuid: string,
    ): Promise<Response>;

    detailNexTeamUsingPersonnelNumber(
        res: Response,
        personnelNumber: string,
    ): Promise<Response>;

    detailNexTeamUsingUUID(res: Response, uuid: string): Promise<Response>;
}
