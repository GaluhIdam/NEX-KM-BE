import { CommentLikeActivity } from './../../../../../node_modules/@prisma/clients/nex-community/index.d';
import { ActivityCommentLikeDTO } from '../dtos/community-activity.dto';

export interface CommunityActivityLikeServiceInterface {
    likeDislikeComment(
        activityId: number,
        commentActivityId: number,
        personalNumber: string,
        dto: ActivityCommentLikeDTO,
    ): Promise<CommentLikeActivity>;
}
