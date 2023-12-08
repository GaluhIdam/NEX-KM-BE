import {
  Controller,
  Get,
  Query,
  Res,
  Post,
  Body,
  UseInterceptors,
  Param,
  Put,
  UploadedFiles,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { StoryControllerInterface } from '../interfaces/story.controller.interface';
import { StoryService } from '../services/story.service';
import { Response } from 'express';
import { StoryDTO } from '../dtos/story.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { JobInterface } from 'src/core/utility/video-upload/interfaces/job.interface';
import { StoryStatusDTO, StoryStatusOnlyDTO } from '../dtos/story-status.dto';
import { StoryWatchDTO } from '../dtos/story-watch.dto';

@Controller({ path: 'api/story', version: '1' })
export class StoryController
  extends BaseController
  implements StoryControllerInterface {
  constructor(
    @InjectQueue('video-upload') private readonly videouploadQueue: Queue,
    private readonly storyService: StoryService,
  ) {
    super(StoryController.name);
  }

  //Get Statistic
  @Get('statistic/:category')
  async getStatisticStory(
    @Res() res: Response<any, Record<string, any>>,
    @Param('category') category: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.storyService.getStatisticStory(category);
      return res
        .status(200)
        .send(this.responseMessage('story statistic', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getStory(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('category') category: string,
    @Query('sortBy') sortBy: string,
    @Query('isAdmin') isAdmin: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.storyService.getStory(
        page,
        limit,
        search,
        category,
        sortBy,
        isAdmin,
      );
      return res
        .status(200)
        .send(this.responseMessage('story', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Story By Id
  @Get('/:uuid')
  async getStoryById(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    this.validateUUID(uuid);
    const result = await this.storyService.getStoryById(uuid);
    return res
      .status(200)
      .send(this.responseMessage('story', 'Get', 200, result));
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            let destination: any;
            if (file.fieldname === 'video') {
              destination = './uploads/story/video';
            } else if (file.fieldname === 'cover') {
              destination = './uploads/story/cover';
            }
            cb(null, destination);
          },
          filename: (req, file, cb) => {
            const randomNameFile =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extensionFile = extname(file.originalname);
            const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
            cb(null, fileName);
          },
        }),
      },
    ),
  )
  async createStory(
    @Res() res: Response,
    @Body() dto: any,
    @UploadedFiles()
    files: {
      video: Express.Multer.File;
      cover: Express.Multer.File;
    },
  ): Promise<Response> {
    try {
      this.validateVideo(files.video[0]);
      this.validateSingleImage(files.cover[0]);
      const data: StoryDTO = {
        uploadBy: dto.uploadBy,
        category: dto.category,
        title: dto.title,
        description: dto.description,
        personalNumber: dto.personalNumber,
        unit: dto.unit,
        video: files.video[0].filename,
        path: `story/video/${files.video[0].filename}`,
        cover: `story/cover/${files.cover[0].filename}`,
      };
      await this.errorsValidation(StoryDTO, data, files.cover, files.video);
      const result = await this.storyService.createStory(data);
      return res.status(201).send(this.responseMessage('story', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Story
  @Put('/:uuid')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            let destination: any;
            if (file.fieldname === 'video') {
              destination = './uploads/story/video';
            } else if (file.fieldname === 'cover') {
              destination = './uploads/story/cover';
            }
            cb(null, destination);
          },
          filename: (req, file, cb) => {
            const randomNameFile =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extensionFile = extname(file.originalname);
            const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
            cb(null, fileName);
          },
        }),
      },
    ),
  )
  async updateStory(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: StoryDTO,
    @UploadedFiles()
    files: {
      video: Express.Multer.File;
      cover: Express.Multer.File;
    },
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(uuid);
      const data: StoryDTO = {
        uploadBy: dto.uploadBy,
        category: dto.category,
        title: dto.title,
        description: dto.description,
        personalNumber: dto.personalNumber,
        unit: dto.unit,
        video: files.video[0].filename,
        path: `story/video/${files.video[0].filename}`,
        cover: `story/cover/${files.cover[0].filename}`,
      };
      await this.errorsValidation(StoryDTO, data, files.video, files.cover);
      const result = await this.storyService.updateStory(uuid, data);
      return res.status(201).send(
        this.responseMessage('story', 'Create', 201, result),
      );
    } catch (error) {
      throw error;
    }
  }

  //Delete Story
  async deleteStory(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.storyService.deleteStory(uuid);
      return res
        .status(200)
        .send(this.responseMessage('story', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Approve or Rejection
  @Put('/approve-reject/:uuid')
  async approveReject(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: StoryStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(uuid);
      await this.errorsValidation(StoryStatusDTO, dto);
      const result = await this.storyService.approveReject(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('story', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Editor Choice
  @Put('editor-choice/:uuid')
  async editorChoice(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: StoryStatusOnlyDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(uuid);
      const result = await this.storyService.editorChoice(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('story', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Banned Action
  @Put('/active-deactive/:uuid')
  async activeDeactive(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: StoryStatusOnlyDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(uuid);
      const result = await this.storyService.activeDeactive(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('story', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Wacth Story
  @Post('watch-story')
  async watchStory(
    @Res() res: Response<any, Record<string, any>>,
    @Query('uuid') uuid: string,
    @Query('personalNumber') personalNumber: string,
    @Query('storyId') storyId: number,
    @Body() dto: StoryWatchDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.storyService.watchStory(
        uuid,
        personalNumber,
        storyId,
        dto,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('watch story', 'Check and Create', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }
}
