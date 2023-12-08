import { Response } from 'express';
import { ArticleCategoryDTO, ArticleCategoryStatusDTO } from '../dtos/article-category.dto';

export interface ArticleCategoryControllerInterface {

    getCategoryArticle(res: Response, page?: number, limit?: number, search?: string, optionx?: string): Promise<Response>;

    createCategoryArticle(res: Response, dto: ArticleCategoryDTO): Promise<Response>;

    updateCategoryArticle(res: Response, uuid: string, dto: ArticleCategoryDTO): Promise<Response>;

    deleteCategoryArticle(res: Response, uuid: string): Promise<Response>;

    activeDeactive(res: Response, uuid: string, dto: ArticleCategoryStatusDTO): Promise<Response>;
}