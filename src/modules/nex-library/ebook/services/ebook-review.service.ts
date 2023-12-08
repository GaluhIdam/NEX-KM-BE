import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { EbookReviewServiceInterface } from '../interfaces/ebook-review.service.interface';
import { EbookReviews } from '@prisma/clients/nex-library';
import { EbookReviewsDTO } from '../dtos/ebook-reviews.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';

@Injectable()
export class EbookReviewService
  extends AppError
  implements EbookReviewServiceInterface
{
  constructor(private readonly prisma: PrismaLibraryService) {
    super(EbookReviewService.name);
  }

  //Get EBook Reviews
  async getEbookReviews(
    page: number,
    limit: number,
    ebookId: number,
    sortBy?: string,
  ): Promise<PaginationDTO<EbookReviews[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const by_order = {};

    if (sortBy == 'desc' || sortBy == 'asc') {
      by_order['createdAt'] = sortBy;
    }

    const result = await this.prisma.ebookReviews.findMany({
      where: {
        ebookId: ebookId,
      },
      skip: skip,
      take: take,
      orderBy: by_order,
    });

    const totalItems = await this.prisma.ebookReviews.count({
      where: {
        ebookId: ebookId,
      },
    });
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<EbookReviews[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Ebook Reviews');
    return response;
  }

  //Create Ebook Reviews
  async createEbookReview(dto: EbookReviewsDTO): Promise<EbookReviews> {
    const findData = await this.prisma.ebook.findFirst({
      where: {
        id: dto.ebookId,
      },
    });
    this.handlingErrorNotFound(findData, dto.ebookId, 'Ebook');
    return await this.prisma.ebookReviews.create({
      data: {
        ebookId: dto.ebookId,
        personalNumber: dto.personalNumber,
        message: dto.message,
        rate: dto.rate,
      },
    });
  }

  //Update Ebook Review
  async updateEbookReview(
    uuid: string,
    dto: EbookReviewsDTO,
  ): Promise<EbookReviews> {
    const findData = await this.prisma.ebookReviews.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Ebook Review');
    const checkId = await this.prisma.ebook.findFirst({
      where: {
        id: dto.ebookId,
      },
    });
    this.handlingErrorNotFound(checkId, dto.ebookId, 'Ebook');
    return await this.prisma.ebookReviews.update({
      where: {
        uuid: uuid,
      },
      data: {
        ebookId: dto.ebookId,
        personalNumber: dto.personalNumber,
        message: dto.message,
        rate: dto.rate,
      },
    });
  }

  //Delete Ebook Review
  async deleteEbookReview(uuid: string): Promise<EbookReviews> {
    const findData = await this.prisma.ebookReviews.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Ebook Review');
    return await this.prisma.ebookReviews.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
