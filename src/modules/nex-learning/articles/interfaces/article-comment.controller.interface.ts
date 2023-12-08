import { Response } from 'express';
import { ArticleCommentDTO } from '../dtos/article-comment.dto';

export interface ArticleCommentControllerInterface {
    getComments(res: Response, id_article: number, page: number, limit: number, sortBy: string): Promise<Response>;

    getChildComments(res: Response, id_article: number, parentId: number, page: number, limit: number, sortBy: string): Promise<Response>;

    createComments(res: Response, dto: ArticleCommentDTO): Promise<Response>;

    updateComments(res: Response, uuid: string, dto: ArticleCommentDTO): Promise<Response>;

    deleteComments(res: Response, uuid: string): Promise<Response>;
}