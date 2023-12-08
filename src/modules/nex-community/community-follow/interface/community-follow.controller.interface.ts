import { Response } from 'express';
import { CommunityFollowDTO } from '../dtos/community-follow.dto';

export interface CommunityFollowControllerInterface {
    getCommunityUser(res: Response, personalNumber: string): Promise<Response>;
    getCommunityFollow(
        res: Response,
        page: number,
        limit: number,
        communityId: number,
    ): Promise<Response>;

    getCommunityFollowByPersonalNumber(
        res: Response,
        personalNumber: string,
        communityId: number,
    ): Promise<Response>;

    createCommunityFollow(
        res: Response,
        data: CommunityFollowDTO,
    ): Promise<Response>;

    deleteCommunityFollow(res: Response, uuid: string): Promise<Response>;
}
