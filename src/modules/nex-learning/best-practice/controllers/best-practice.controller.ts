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
import { BestPracticeControllerInterface } from '../interfaces/best-practice.controller.interface';
import { BaseController } from 'src/core/controllers/base.controller';
import { Response } from 'express';
import {
  BestPracticeDTO,
  BestPracticeApproveDTO,
  CommentLikeBestPracticeDTO,
} from '../dtos/best-practice.dto';
import { BestPracticeService } from '../services/best-practice.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArticleStatusDTO } from '../../articles/dtos/article-status.dto';
import { CommentBestPracticeDTO } from '../dtos/comment-best-practice.dto';

@Controller({ path: 'api/best-practice', version: '1' })
export class BestPracticeController
  extends BaseController
  implements BestPracticeControllerInterface
{
  constructor(private readonly bestPracticeService: BestPracticeService) {
    super(BestPracticeController.name);
  }

  //Get Statistic
  @Get('statistic')
  async getStatisticBestPractice(
    @Res() res: Response<any, Record<string, any>>,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.bestPracticeService.getStatisticBestPractice();
      return res
        .status(200)
        .send(
          this.responseMessage('best practice statistic', 'Get', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Get Comment By Id
  @Get('reply-comment')
  async getReplyComment(
    @Res() res: Response<any, Record<string, any>>,
    @Query('parentId') parentId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.bestPracticeService.getReplyComment(
        parentId,
        page,
        limit,
      );
      return res
        .status(200)
        .send(this.responseMessage('get reply comment', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Comment
  @Get('/comment')
  async getComment(
    @Res() res: Response<any, Record<string, any>>,
    @Query('practiceId') practiceId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.bestPracticeService.getComment(
        practiceId,
        page,
        limit,
        sortBy,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('Comment Best Practice', 'Get', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Best Practice
  @Get()
  async getBestPractice(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.bestPracticeService.getBestPractice(
        page,
        limit,
        search,
        sortBy,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('best practice', 'Getting data', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Get Best Practice with UUID
  @Get('/:uuid')
  async getBestPracticeById(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(uuid);
      const result = await this.bestPracticeService.getBestPracticeById(uuid);
      return res
        .status(200)
        .send(
          this.responseMessage('best practice', 'Getting data', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Create Best Practice
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/best-practice/cover',
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
  async createBestPractice(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: BestPracticeDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: BestPracticeDTO = {
        personalNumber: dto.personalNumber,
        title: dto.title,
        content: dto.content,
        image: image.filename,
        path: `best-practice/cover/${image.filename}`,
        uploadBy: dto.uploadBy,
        unit: dto.unit,
      };
      await this.errorsValidation(BestPracticeDTO, data, image);
      const result = await this.bestPracticeService.createBestPractice(data);
      return res
        .status(201)
        .send(this.responseMessage('best practice', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Best Practice
  @Put('/:uuid')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/best-practice/cover',
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
  async updateBestPractice(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: BestPracticeDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: BestPracticeDTO = {
        personalNumber: dto.personalNumber,
        title: dto.title,
        content: dto.content,
        image: image.filename,
        path: `best-practice/cover/${image.filename}`,
        uploadBy: dto.uploadBy,
        unit: dto.unit,
      };
      await this.errorsValidation(BestPracticeDTO, data, image);
      const result = await this.bestPracticeService.updateBestPractice(
        uuid,
        data,
      );
      return res
        .status(200)
        .send(this.responseMessage('best practice', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Best Practice
  @Delete('/:uuid')
  async deleteBestPractice(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.bestPracticeService.deleteBestPractice(uuid);
      return res
        .status(200)
        .send(this.responseMessage('best practice', 'Delete', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Approve or Reject
  @Put('approve-reject/:uuid')
  async approveReject(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: BestPracticeApproveDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.errorsValidation(BestPracticeApproveDTO, dto);
      const result = await this.bestPracticeService.approveReject(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('best practice', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Editor Choice
  @Put('editor-choice/:uuid')
  async editorChoice(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: ArticleStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.bestPracticeService.editorChoice(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('best practice', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Put('active-deactive/:uuid')
  async activeDeactive(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: ArticleStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.bestPracticeService.activeDeactive(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('best practice', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Post('comment')
  async createComment(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: CommentBestPracticeDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.bestPracticeService.createComment(dto);
      return res
        .status(201)
        .send(
          this.responseMessage('Create', 'Comment Best Practice', 201, result),
        );
    } catch (error) {
      throw error;
    }
  }

  @Put('comment/:uuid')
  async updateComment(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: CommentBestPracticeDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.bestPracticeService.updateComment(uuid, dto);
      return res
        .status(200)
        .send(
          this.responseMessage(`Update`, `Comment Best Practice`, 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  @Delete('comment/:uuid')
  async deleteComment(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.bestPracticeService.deleteComment(uuid);
      return res
        .status(200)
        .send(
          this.responseMessage(`Delete`, `Comment Best Practice`, 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  @Post('like')
  async likeDislikeComment(
    @Res() res: Response<any, Record<string, any>>,
    @Query('bestPracticeId') bestPracticeId: number,
    @Query('commentBestPracticeId') commentBestPracticeId: number,
    @Query('personalNumber') personalNumber: string,
    @Body() dto: CommentLikeBestPracticeDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.bestPracticeService.likeDislikeComment(
        bestPracticeId,
        commentBestPracticeId,
        personalNumber,
        dto,
      );
      return res
        .status(201)
        .send(this.responseMessage('like', 'check', 201, result));
    } catch (error) {
      throw error;
    }
  }
}
