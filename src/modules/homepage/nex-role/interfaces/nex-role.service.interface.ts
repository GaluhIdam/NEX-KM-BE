import { NexRoles } from '@prisma/clients/homepage';
import { NexRoleDTO } from '../dtos/nex-role.dto';

export interface NexRoleServiceInterface {
  findFirstHundredNexRolesData(
    page: number,
    limit: number,
  ): Promise<NexRoleDTO[]>;

  findNexRoleByUUID(uuid: string): Promise<NexRoles>;

  createNexRoleData(dto: NexRoleDTO): Promise<boolean>;

  deleteNexRoleData(uuid: string): Promise<boolean>;

  updateNexRoleData(dto: NexRoleDTO, uuid: string): Promise<boolean>;
}
