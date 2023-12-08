import { Response } from 'express';
import { CommunityRoleDTO } from '../dtos/community-role.dto';

export interface CommunityRoleControllerInterface {
  getCommunityRole(res: Response, page: number, limit: number, search: string, sortBy: string): Promise<Response>;

  createCommunityRole(res: Response, dto: CommunityRoleDTO): Promise<Response>;

  updateCommunityRole(res: Response, uuid: string, dto: CommunityRoleDTO): Promise<Response>;

  deleteCommunityRole(res: Response, uuid: string): Promise<Response>;
}
