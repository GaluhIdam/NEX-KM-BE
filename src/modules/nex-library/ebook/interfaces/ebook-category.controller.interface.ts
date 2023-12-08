import { Response } from 'express';
import { EbookCategoryDTO } from '../dtos/ebook-category.dto';
import { EbookCategoryStatusDTO } from '../dtos/ebook-category-status.dto';

export interface EbookCategoryControllerInterface {
    getEbookCategory(
        res: Response,
        page: number,
        limit: number,
        search?: string,
        is_active?: string,
        sort_by?: string,
    ): Promise<Response>;

    createEbookCategory(
        res: Response,
        dto: EbookCategoryDTO,
    ): Promise<Response>;

    updateEbookCategory(
        res: Response,
        uuid: string,
        dto: EbookCategoryDTO,
    ): Promise<Response>;

    updateEbookCategoryStatus(
        res: Response,
        uuid: string,
        dto: EbookCategoryStatusDTO,
    ): Promise<Response>;

    deleteEbookCategory(res: Response, uuid: string): Promise<Response>;
}
