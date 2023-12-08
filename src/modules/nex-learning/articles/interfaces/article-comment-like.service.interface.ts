import { CommentLikeArticle } from '@prisma/clients/nex-learning';
import { ArticleCommentLikeDTO } from '../dtos/article-comment-like.dto';
export interface ArticleCommentLikeServiceInterface {
  likeDislikeComment(
    articleId: number,
    commentArticleId: number,
    personalNumber: string,
    dto: ArticleCommentLikeDTO,
  ): Promise<CommentLikeArticle>;
}
