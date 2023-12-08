import { NexTeams } from '@prisma/clients/homepage';
import { CreateNexTeamDTO, GetUsersQueryDTO, UpdateNexTeamDTO } from '../dtos';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface NexTeamServiceInterface {
  findFirstHundredNexTeamsData(
    queryParams: GetUsersQueryDTO,
  ): Promise<ResponseDTO<NexTeams[]>>;

  findNexTeamByUUID(uuid: string): Promise<NexTeams>;

  findNexTeamByPersonnelNumber(personnelNumber: string): Promise<NexTeams>;

  createNexTeamData(dto: CreateNexTeamDTO): Promise<NexTeams>;

  deleteNexTeamDataByUUID(uuid: string): Promise<void>;

  updateNexTeamDataByPersonnelNumber(
    dto: UpdateNexTeamDTO,
    uuid: string,
  ): Promise<NexTeams>;
}
