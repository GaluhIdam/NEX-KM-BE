import { Response } from 'express';
import { CommunityActivityDTO } from '../dtos/community-activity.dto';

export interface CommunityActivityControllerInterface {
    getCommunityActivity(
        res: Response,
        page: number,
        limit: number,
        search: string,
        sortBy: string,
    ): Promise<Response>;

    getCommunityActivityByCommunity(
        res: Response,
        page: number,
        limit: number,
        search: string,
        sortBy: string,
        communityId: number,
    ): Promise<Response>;

    getActivityById(res: Response, uuid: string): Promise<Response>;

    createCommunityActivity(
        res: Response,
        dto: CommunityActivityDTO,
        image: Express.Multer.File,
    ): Promise<Response>;

    updateCommunityActivity(
        res: Response,
        uuid: string,
        dto: CommunityActivityDTO,
        image: Express.Multer.File,
    ): Promise<Response>;

    deleteCommunityActivity(res: Response, uuid: string): Promise<Response>;

    getActivityByUserMember(
        res: Response,
        personalNumber: string,
        page: number,
        limit: number,
    ): Promise<Response>;
}
