import { Response } from 'express';
import { ArticleStatusDTO } from '../dtos/article-status.dto';
import { StatisticArticleDTO } from '../dtos/article.dto';

export interface ArticleControllerInterface {
  //User Method
  getArticleByPersonalNumber(
    res: Response,
    page: number,
    limit: number,
    personalNumber: string,
    search?: string,
    sortBy?: string,
  ): Promise<Response>;

  getArticle(
    res: Response,
    page: number,
    limit: number,
    articleCategoryId?: number,
    search?: string,
    sortBy?: string,
    isAdmin?: string,
  ): Promise<Response>;

  getArticleById(res: Response, uuid: string): Promise<Response>;

  createArticle(
    res: Response,
    dto: any,
    image: Express.Multer.File,
  ): Promise<Response>;

  updateArticle(
    res: Response,
    uuid: string,
    dto: any,
    image: Express.Multer.File,
  ): Promise<Response>;

  deleteArticle(res: Response, uuid: string): Promise<Response>;

  // Admin Method
  approvalRejection(
    res: Response,
    uuid: string,
    dto: ArticleStatusDTO,
  ): Promise<Response>;

  editorChoice(
    res: Response,
    uuid: string,
    dto: ArticleStatusDTO,
  ): Promise<Response>;

  activeDeactive(
    res: Response,
    uuid: string,
    dto: ArticleStatusDTO,
  ): Promise<Response>;

  getStatisticArticle(res: Response): Promise<Response>;
}
