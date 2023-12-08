import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { EbookReviewControllerInterface } from '../interfaces/ebook-review.controller.interface';
import { EbookReviewService } from '../services/ebook-review.service';
import { Response } from 'express';
import { EbookReviewsDTO } from '../dtos/ebook-reviews.dto';

@Controller({ path: 'api/ebook-review', version: '1' })
export class EbookReviewController
  extends BaseController
  implements EbookReviewControllerInterface
{
  constructor(private readonly ebookreviewService: EbookReviewService) {
    super(EbookReviewController.name);
  }

  //Get Ebook Reviews
  @Get()
  async getEbookReviews(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('ebookId') ebookId: number,
    @Query('sortBy') sortBy?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      this.validateUUID(ebookId);
      const result = await this.ebookreviewService.getEbookReviews(
        page,
        limit,
        Number(ebookId),
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('ebook review', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Ebook Review
  @Post()
  async createEbookReview(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: EbookReviewsDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.errorsValidation(EbookReviewsDTO, dto);
      const result = await this.ebookreviewService.createEbookReview(dto);
      return res
        .status(201)
        .send(this.responseMessage('ebook review', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Ebook Review
  @Put('/:uuid')
  async updateEbookReview(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: EbookReviewsDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(EbookReviewsDTO, dto);
      const result = await this.ebookreviewService.updateEbookReview(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('ebook review', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Ebook Review
  @Delete('/:uuid')
  async deleteEbookReview(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.ebookreviewService.deleteEbookReview(uuid);
      return res
        .status(200)
        .send(this.responseMessage('ebook review', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
