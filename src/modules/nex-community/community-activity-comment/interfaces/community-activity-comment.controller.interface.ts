import { Response } from 'express';
import { ActivityCommentDTO } from '../dto/comment-activity.dto';

export interface CommunityCommentActivityControllersInterface {
    getCommentActivity(
        res: Response,
        activityId: number,
        page: number,
        limit: number,
        sortBy: string,
    ): Promise<Response>;

    getChildCommentActivity(
        res: Response,
        activityId: number,
        parentId: number,
        page: number,
        limit: number,
        sortBy: string,
    ): Promise<Response>;

    createComment(res: Response, dto: ActivityCommentDTO): Promise<Response>;

    updateComment(
        res: Response,
        uuid: string,
        dto: ActivityCommentDTO,
    ): Promise<Response>;

    deleteCommunity(res: Response, uuid: string): Promise<Response>;
}
