import { Response } from 'express';
import { EbookReviewsDTO } from '../dtos/ebook-reviews.dto';

export interface EbookReviewControllerInterface {
  getEbookReviews(
    res: Response,
    page: number,
    limit: number,
    ebookId: number,
    sortBy?: string,
  ): Promise<Response>;

  createEbookReview(res: Response, dto: EbookReviewsDTO): Promise<Response>;

  updateEbookReview(
    res: Response,
    uuid: string,
    dto: EbookReviewsDTO,
  ): Promise<Response>;

  deleteEbookReview(res: Response, uuid: string): Promise<Response>;
}
