import { CommunityRoles } from '@prisma/clients/nex-community';
import { CommunityRoleDTO } from '../dtos/community-role.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface CommunityRoleServiceInterface {
  getCommunityRole(page: number, limit: number, search: string, sortBy: string): Promise<ResponseDTO<CommunityRoles[]>>;

  createCommunityRole(dto: CommunityRoleDTO): Promise<CommunityRoles>;

  updateCommunityRole(uuid: string, dto: CommunityRoleDTO): Promise<CommunityRoles>;

  deleteCommunityRole(uuid: string): Promise<CommunityRoles>;
}
