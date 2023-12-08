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
import { ArticleCommentService } from '../services/article-comment.service';
import { Response } from 'express';
import { ArticleCommentControllerInterface } from '../interfaces/article-comment.controller.interface';
import { ArticleCommentDTO } from '../dtos/article-comment.dto';

@Controller({ path: 'api/article-comment', version: '1' })
export class ArticleCommentController
  extends BaseController
  implements ArticleCommentControllerInterface
{
  constructor(private readonly articlecommentService: ArticleCommentService) {
    super(ArticleCommentController.name);
  }

  //Get Comments
  @Get()
  async getComments(
    @Res() res: Response<any, Record<string, any>>,
    @Query('id_article') id_article: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      this.validateUUID(id_article);
      const result = await this.articlecommentService.getComments(
        Number(id_article),
        page,
        limit,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('comment', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Child Comment
  @Get('child-comments')
  async getChildComments(
    @Res() res: Response<any, Record<string, any>>,
    @Query('id_article') id_article: number,
    @Query('parentId') parentId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.articlecommentService.getChildComments(
        Number(id_article),
        Number(parentId),
        page,
        limit,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('child comment', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Comments
  @Post()
  async createComments(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: ArticleCommentDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.errorsValidation(ArticleCommentDTO, dto);
      const result = await this.articlecommentService.createComments(dto);
      return res
        .status(201)
        .send(this.responseMessage('comment', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Comment
  @Put('/:uuid')
  async updateComments(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: ArticleCommentDTO,
  ): Promise<Response<any, Record<string, any>>> {
    this.isValidUUID(uuid);
    const result = await this.articlecommentService.updateComments(uuid, dto);
    return res
      .status(200)
      .send(this.responseMessage('comment', 'Update', 200, result));
  }

  //Delete Comments
  @Delete('/:uuid')
  async deleteComments(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.articlecommentService.deleteComments(uuid);
      return res
        .status(200)
        .send(this.responseMessage('comment', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
