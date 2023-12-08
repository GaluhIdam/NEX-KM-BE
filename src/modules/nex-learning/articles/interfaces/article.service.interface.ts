import { Article } from '@prisma/clients/nex-learning';
import { ArticleDTO, StatisticArticleDTO } from '../dtos/article.dto';
import { ArticleStatusDTO } from '../dtos/article-status.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
export interface ArticleServiceInterface {
  //User Medthod
  getArticleByPersonalNumber(
    page: number,
    limit: number,
    personalNumber: string,
    search?: string,
    sortBy?: string,
  ): Promise<ResponseDTO<Article[]>>;

  getArticle(
    page: number,
    limit: number,
    articleCategoryId?: number,
    search?: string,
    sortBy?: string,
    isAdmin?: string,
  ): Promise<ResponseDTO<Article[]>>;

  getArticleById(uuid: string): Promise<Article>;

  createArticle(dto: ArticleDTO): Promise<Article>;

  updateArticle(uuid: string, dto: ArticleDTO): Promise<Article>;

  deleteArticle(uuid: string): Promise<Article>;

  //Admin Method
  approvalRejection(uuid: string, dto: ArticleStatusDTO): Promise<Article>;

  editorChoice(uuid: string, dto: ArticleStatusDTO): Promise<Article>;

  activeDeactive(uuid: string, dto: ArticleStatusDTO): Promise<Article>;

  //Statistic
  getStatisticArticle(): Promise<StatisticArticleDTO>;
}