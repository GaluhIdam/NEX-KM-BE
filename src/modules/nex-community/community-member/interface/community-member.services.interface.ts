import { CommunityMembers } from '@prisma/clients/nex-community';
import { CommunityMemberDTO } from '../dtos/community-member.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface CommunityMemberServiceInterface {
  getCommunityMember(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    communityId: number,
  ): Promise<ResponseDTO<CommunityMembers[]>>;

  createCommunityMember(dto: CommunityMemberDTO): Promise<CommunityMembers>;

  updateCommunityMember(
    uuid: string,
    dto: CommunityMemberDTO,
  ): Promise<CommunityMembers>;

  deleteCommunityMember(uuid: string): Promise<CommunityMembers>;
}
