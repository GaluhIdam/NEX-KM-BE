import { Response } from 'express';
import { ForumCommentDTO } from '../dtos/forum-comment.dto';
import { ForumCommentChildShowDTO } from '../dtos/forum-comment-child-show.dto';

export interface CommentControllerInterface {
    getComment(
        res: Response,
        page: number,
        limit: number,
        id_forum?: number,
        order_by?: string,
    ): Promise<Response>;

    createComment(res: Response, dto: ForumCommentDTO): Promise<Response>;

    updateComment(
        res: Response,
        uuid: string,
        dto: ForumCommentDTO,
    ): Promise<Response>;

    deleteComment(res: Response, uuid: string): Promise<Response>;

    updateForumCommentChildShow(
        res: Response,
        uuid: string,
        dto: ForumCommentChildShowDTO,
    ): Promise<Response>;
}
