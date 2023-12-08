import {
    CommunityFollows,
    CommunityMembers,
} from '@prisma/clients/nex-community';
import { CommunityFollowDTO } from '../dtos/community-follow.dto';

export interface CommunityFollowServiceInterface {
    getCommunityUser(personalNumber: string): Promise<CommunityMembers[]>;
    getCommunityFollow(
        page: number,
        limit: number,
        communityId: number,
    ): Promise<CommunityFollows[]>;

    getCommunityFollowByPersonalNumber(
        personalNumber: string,
        communityId: number,
    ): Promise<CommunityFollows>;

    createCommunityFollow(dto: CommunityFollowDTO): Promise<CommunityFollowDTO>;

    deleteCommunityFollow(uuid: string): Promise<CommunityFollows>;
}
