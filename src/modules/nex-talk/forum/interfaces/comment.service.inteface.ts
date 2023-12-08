import { CommentForum } from '@prisma/clients/nex-talk';
import { ForumCommentDTO } from '../dtos/forum-comment.dto';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';
import { ForumCommentChildShowDTO } from '../dtos/forum-comment-child-show.dto';
export interface CommentServiceInterface {
  getCommentByForum(
    page: number,
    limit: number,
    id_forum?: number,
    order_by?: string,
  ): Promise<PaginationDTO<CommentForum[]>>;

  createComment(dto: ForumCommentDTO): Promise<CommentForum>;

  updateComment(uuid: string, dto: ForumCommentDTO): Promise<CommentForum>;

  deleteComment(uuid: string): Promise<CommentForum>;

  updateForumCommentChildShow(
    uuid: string,
    dto: ForumCommentChildShowDTO,
  ): Promise<CommentForum>;
}
