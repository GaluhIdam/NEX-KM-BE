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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { ArticleControllerInterface } from '../interfaces/article.controller.interface';
import { ArticleService } from '../services/article.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArticleDTO } from '../dtos/article.dto';
import { ArticleStatusDTO } from '../dtos/article-status.dto';

@Controller({ path: 'api/article', version: '1' })
export class ArticleController
  extends BaseController
  implements ArticleControllerInterface {
  constructor(private readonly articleService: ArticleService) {
    super(ArticleController.name);
  }

  @Get('search')
  async searchUseElastic(
    @Res() res: Response<Record<string, any>>,
    @Query('q') query: string,
  ): Promise<Response<Record<string, any>>> {
    try {
      const result = await this.articleService.searchArticle(query);

      return res
        .status(200)
        .send(this.responseMessage('article', 'Search', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Statistic
  @Get('statistic')
  async getStatisticArticle(
    @Res() res: Response<any, Record<string, any>>,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.articleService.getStatisticArticle();
      return res
        .status(200)
        .send(this.responseMessage('article statistic', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Article By Personal Number
  @Get('my-article')
  async getArticleByPersonalNumber(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('personalNumber') personalNumber: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.articleService.getArticleByPersonalNumber(
        page,
        limit,
        personalNumber,
        search,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('article', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Article
  @Get()
  async getArticle(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('articleCategoryId') articleCategoryId?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('isAdmin') isAdmin?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.articleService.getArticle(
        page,
        limit,
        Number(articleCategoryId),
        search,
        sortBy,
        isAdmin,
      );
      return res
        .status(200)
        .send(this.responseMessage('article', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Get('/:uuid')
  async getArticleById(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.articleService.getArticleById(uuid);
      return res
        .status(200)
        .send(this.responseMessage('article', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Article
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/article/cover',
        filename: (req, file, cb) => {
          const randomNameFile =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extensionFile = extname(file.originalname);
          const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async createArticle(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      await this.checkPoint('Create Article', dto.personalNumber, dto.status);
      const data: ArticleDTO = {
        personalNumber: dto.personalNumber,
        articleCategoryId: Number(dto.articleCategoryId),
        title: dto.title,
        content: dto.content,
        image: image.filename,
        path: `article/cover/${image.filename}`,
        uploadBy: dto.uploadBy,
        unit: dto.unit,
        approvalStatus: null,
        approvalDesc: null,
        approvalBy: null,
        editorChoice: false,
        statusPublish: false,
        bannedStatus: null,
        bannedDesc: null,
      };
      await this.errorsValidation(ArticleDTO, data, image);
      const result = await this.articleService.createArticle(data);
      return res
        .status(201)
        .send(this.responseMessage('article', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Article
  @Put('/:uuid')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/article/cover',
        filename: (req, file, cb) => {
          const randomNameFile =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extensionFile = extname(file.originalname);
          const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async updateArticle(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      this.validateSingleImage(image);
      const data: ArticleDTO = {
        personalNumber: dto.personalNumber,
        articleCategoryId: Number(dto.articleCategoryId),
        title: dto.title,
        content: dto.content,
        image: image.filename,
        path: `article/cover/${image.filename}`,
        uploadBy: dto.uploadBy,
        unit: dto.unit,
        statusPublish: false,
        approvalStatus: false,
        approvalDesc: null,
        approvalBy: null,
        editorChoice: false,
        bannedStatus: false,
        bannedDesc: null,
      };
      await this.errorsValidation(ArticleDTO, data, image);
      const result = await this.articleService.updateArticle(uuid, data);
      return res
        .status(200)
        .send(this.responseMessage('article', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Article
  @Delete('/:uuid')
  async deleteArticle(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.articleService.deleteArticle(uuid);
      return res
        .status(200)
        .send(this.responseMessage('artcile', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Active or Deadactive
  @Put('/active-deadactive/:uuid')
  async activeDeactive(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: ArticleStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    this.isValidUUID(uuid);
    await this.errorsValidation(ArticleStatusDTO, dto);
    const result = await this.articleService.activeDeactive(uuid, dto);
    return res
      .status(200)
      .send(
        this.responseMessage('active deadactive status', 'Update', 200, result),
      );
  }

  //Admin Method

  //Aprove or Reject
  @Put('/approve-reject/:uuid')
  async approvalRejection(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: ArticleStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(ArticleStatusDTO, dto);
      const result = await this.articleService.approvalRejection(uuid, dto);

      await this.checkPoint(
        'Create Article',
        result.personalNumber,
        dto.status,
      );

      return res
        .status(200)
        .send(this.responseMessage('approval status', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Editor Choice
  @Put('/editor-choice/:uuid')
  async editorChoice(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: ArticleStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(ArticleStatusDTO, dto);
      const result = await this.articleService.editorChoice(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('editor choice', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
