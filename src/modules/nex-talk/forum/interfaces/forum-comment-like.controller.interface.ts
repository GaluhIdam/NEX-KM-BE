import { Response } from 'express';
import { ForumCommentLikeDTO } from '../dtos/forum-comment-like.dto';

export interface ForumCommentLikeControllerInterface {
    getForumCommentLike(
        res: Response,
        commentForumId: number,
    ): Promise<Response>;

    updateForumCommentLike(
        res: Response,
        dto: ForumCommentLikeDTO,
    ): Promise<Response>;
}
