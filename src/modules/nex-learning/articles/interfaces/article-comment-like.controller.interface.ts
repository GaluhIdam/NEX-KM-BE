import { ArticleCommentLikeDTO } from '../dtos/article-comment-like.dto';
import { Response } from 'express';

export interface ArticleCommentLikeControllerInterface {
  likeDislikeComment(
    res: Response,
    articleId: number,
    commentArticleId: number,
    personalNumber: string,
    dto: ArticleCommentLikeDTO,
  ): Promise<Response>;
}
