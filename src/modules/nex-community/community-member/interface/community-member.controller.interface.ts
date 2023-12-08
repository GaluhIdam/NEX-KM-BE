import { Response } from 'express';
import { CommunityMemberDTO } from '../dtos/community-member.dto';

export interface CommunityMemberControllerInterface {
  getCommunityMember(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    communityId: number,
  ): Promise<Response>;

  createCommunityMember(
    res: Response,
    dto: CommunityMemberDTO,
  ): Promise<Response>;

  updateCommunityMember(
    res: Response,
    uuid: string,
    dto: CommunityMemberDTO,
  ): Promise<Response>;

  deleteCommunityMember(res: Response, uuid: string): Promise<Response>;
}
