import { CommunityActivities } from '@prisma/clients/nex-community';
import { CommunityActivityDTO } from '../dtos/community-activity.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { Observable } from 'rxjs';

export interface CommunityActivityServiceInterface {
    getCommunityActivity(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
    ): Promise<ResponseDTO<CommunityActivities[]>>;

    getCommunityActivityByCommunity(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
        communityId: number,
    ): Promise<ResponseDTO<CommunityActivities[]>>;

    geeActivityById(uuid: string): Promise<CommunityActivities>;

    createCommunityActivity(
        dto: CommunityActivityDTO,
    ): Promise<CommunityActivities>;

    updateCommunityActivity(
        uuid: string,
        dto: CommunityActivityDTO,
    ): Promise<CommunityActivityDTO>;

    deleteCommunityActivity(uuid: string): Promise<CommunityActivities>;

    getActivityByUserMember(
        personalNumber: string,
        page: number,
        limit: number,
    ): Promise<ResponseDTO<CommunityActivities[]>>;
}
