import { CommentForumLike } from '@prisma/clients/nex-talk';
import { ForumCommentLikeDTO } from '../dtos/forum-comment-like.dto';

export interface ForumCommentLikeServiceInterface {
    getForumCommentLike(commentForumId: number): Promise<CommentForumLike[]>;

    bulkUpdateForumCommentLike(
        dto: ForumCommentLikeDTO,
    ): Promise<CommentForumLike>;
}
