import { EbookReviews } from '@prisma/clients/nex-library';
import { EbookReviewsDTO } from '../dtos/ebook-reviews.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';

export interface EbookReviewServiceInterface {
  getEbookReviews(
    page: number,
    limit: number,
    ebookId: number,
    sortBy?: string,
  ): Promise<PaginationDTO<EbookReviews[]>>;

  createEbookReview(dto: EbookReviewsDTO): Promise<EbookReviews>;

  updateEbookReview(uuid: string, dto: EbookReviewsDTO): Promise<EbookReviews>;

  deleteEbookReview(uuid: string): Promise<EbookReviews>;
}
