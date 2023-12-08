import { CategoryArticle } from '@prisma/clients/nex-learning';
import { ArticleCategoryDTO, ArticleCategoryStatusDTO } from '../dtos/article-category.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
export interface ArticleCategoryServiceInterface {

    getCategoryArticle(page?: number, limit?: number, search?: string, optionx?: string): Promise<ResponseDTO<CategoryArticle[]>>;

    createCategoryArticle(dto: ArticleCategoryDTO): Promise<CategoryArticle>;

    updateCategoryArticle(uuid: string, dto: ArticleCategoryDTO): Promise<CategoryArticle>;

    deleteCategoryArticle(uuid: string): Promise<CategoryArticle>;

    activeDeactive(uuid: string, dto: ArticleCategoryStatusDTO): Promise<CategoryArticle>;

}