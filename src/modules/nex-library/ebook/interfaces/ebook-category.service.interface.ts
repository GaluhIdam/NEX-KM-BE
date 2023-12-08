import { EbookCategories } from '@prisma/clients/nex-library';
import { EbookCategoryDTO } from '../dtos/ebook-category.dto';
import { EbookCategoryStatusDTO } from '../dtos/ebook-category-status.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';

export interface EbookCategoryServiceInterface {
    getEbookCategory(
        page: number,
        limit: number,
        search?: string,
        is_active?: boolean,
        sort_by?: string,
    ): Promise<PaginationDTO<EbookCategories[]>>;

    getEbookCategoryById(id_ebook_category: number): Promise<EbookCategories>;

    createEbookCategory(dto: EbookCategoryDTO): Promise<EbookCategories>;

    updateEbookCategory(
        uuid: string,
        dto: EbookCategoryDTO,
    ): Promise<EbookCategories>;

    updateEbookCategoryStatus(
        uuid: string,
        dto: EbookCategoryStatusDTO,
    ): Promise<EbookCategories>;

    deleteEbookCategory(uuid: string): Promise<EbookCategories>;
}
