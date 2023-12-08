import { ActivityCommentLikeDTO } from '../dtos/community-activity.dto';
import { Response } from 'express';

export interface CommunityActivityLikeControllerInterface {
    likeDislikeComment(
        res: Response,
        activityId: number,
        commentActivityId: number,
        personalNumber: string,
        dto: ActivityCommentLikeDTO,
    ): Promise<Response>;
}
