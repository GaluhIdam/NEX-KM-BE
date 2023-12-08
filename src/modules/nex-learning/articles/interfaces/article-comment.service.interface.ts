import { CommentArticle } from '@prisma/clients/nex-learning';
import { ArticleCommentDTO } from '../dtos/article-comment.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
export interface ArticleCommentServiceInterface {

    getComments(id_article: number, page: number, limit: number, sortBy: string): Promise<ResponseDTO<CommentArticle[]>>;

    getChildComments(id_article: number, parentId: number, page: number, limit: number, sortBy: string): Promise<ResponseDTO<CommentArticle[]>>;

    createComments(dto: ArticleCommentDTO): Promise<CommentArticle>;

    updateComments(uuid: string, dto: ArticleCommentDTO): Promise<CommentArticle>;

    deleteComments(uuid: string): Promise<CommentArticle>;

}