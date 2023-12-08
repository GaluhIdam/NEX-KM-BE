import { CommentActivity } from '@prisma/clients/nex-community';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { ActivityCommentDTO } from '../dto/comment-activity.dto';

export interface CommunityCommentActivityServicesInterface {
    getCommentActivity(
        activityId: number,
        page: number,
        limit: number,
        sortBy: string,
    ): Promise<ResponseDTO<CommentActivity[]>>;

    getChildCommentActivity(
        activityId: number,
        parentId: number,
        page: number,
        limit: number,
        sortBy: string,
    ): Promise<ResponseDTO<CommentActivity[]>>;

    createComment(dto: ActivityCommentDTO): Promise<CommentActivity>;

    updateComment(
        uuid: string,
        dto: ActivityCommentDTO,
    ): Promise<CommentActivity>;

    deleteCommunity(uuid: string): Promise<CommentActivity>;
}
