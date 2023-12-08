import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { StreamControllerInterface } from '../interfaces/stream.controller.interface';
import { StreamService } from '../services/stream.service';
import { Response } from 'express';
import { StreamDTO } from '../dtos/stream.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { FavoriteDTO } from '../dtos/favorite.dto';
import { StreamEditorChoiceDTO } from '../dtos/stream-editor-choice.dto';
import { StreamStatusDTO } from '../dtos/stream-status.dto';
import { StreamStatusApprovalDTO } from '../dtos/stream-status.approval.dto';
import { unlinkSync } from 'fs';

@Controller({ path: 'api/stream', version: '1' })
export class StreamController
  extends BaseController
  implements StreamControllerInterface {
  constructor(
    @InjectQueue('video-upload') private readonly videouploadQueue: Queue,
    private readonly streamService: StreamService,
  ) {
    super(StreamController.name);
  }

  @Get('search')
  async search(
    @Res() res: Response<Record<string, any>>,
    @Query('q') query: string,
  ): Promise<Response<Record<string, any>>> {
    try {
      const result = await this.streamService.search(query);

      return res
        .status(200)
        .send(this.responseMessage('stream', 'Search', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Stream
  @Get()
  async getStream(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('orderBy') orderBy?: string,
    @Query('search') search?: string,
    @Query('editorChoice') editorChoice?: string,
    @Query('personalNumber') personalNumber?: string,
    @Query('status') status?: string,
    @Query('approval_status') approvalStatus?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);

      let isEditorChoice = null;

      if (editorChoice) {
        isEditorChoice = this.validationBooleanParams(editorChoice);
      }

      let isActive = null;

      if (status) {
        isActive = this.validationBooleanParams(status);
      }

      const result = await this.streamService.getStream(
        page,
        limit,
        orderBy,
        search,
        isEditorChoice,
        personalNumber,
        isActive,
        approvalStatus,
      );
      return res
        .status(200)
        .send(this.responseMessage('stream', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Stream Statistic
  @Get('/statistic')
  async getStreamStatistic(
    @Res() res: Response<any, Record<string, any>>,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const streams = await this.streamService.getStreamStatistic();
      return res
        .status(200)
        .send(this.responseMessage('Stream Statistic', 'Get', 200, streams));
    } catch (error) {
      throw error;
    }
  }

  //Get Stream By Uuid
  @Get('/:uuid')
  async getStreamByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const stream = await this.streamService.getStreamByUuid(uuid);
      return res
        .status(200)
        .send(this.responseMessage('Stream', 'Get by Id', 200, stream));
    } catch (error) {
      throw error;
    }
  }

  //Create Stream
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          filename: (req, file, cb) => {
            const randomNameFile =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extensionFile = extname(file.originalname);
            const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
            cb(null, fileName);
          },
          destination: (req, file, cb) => {
            let destination: any;
            if (file.fieldname === 'file') {
              destination = './uploads/stream/file';
            } else if (file.fieldname === 'thumbnail') {
              destination = './uploads/stream/thumbnail';
            }
            cb(null, destination);
          },
        }),
      },
    ),
  )
  async createStream(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: any,
    @UploadedFiles()
    files: {
      file: Express.Multer.File;
      thumbnail: Express.Multer.File;
    },
  ): Promise<Response<any, Record<string, any>>> {
    try {
      if (files.file && files.thumbnail) {
        this.validateVideo(files.file[0]);
        this.validateSingleImage(files.thumbnail[0]);
        await this.checkPoint('Create Stream', dto.personalNumber, dto.status);
        const data: StreamDTO = {
          talkCategoryId: Number(dto.talkCategoryId),
          title: dto.title,
          description: dto.description,
          personalNumber: dto.personalNumber,
          createdBy: dto.createdBy,
          unit: dto.unit,
          thumbnail: files.thumbnail[0].filename,
          pathThumbnail: `stream/thumbnail/${files.thumbnail[0].filename}`,
          video: files.file[0].filename.split('.').slice(0, -1).join('.'),
          pathVideo: `${files.file[0].path
            .replace('uploads/', '')
            .split('.')
            .slice(0, -1)
            .join('.')}/${files.file[0].filename}/transcodeMP4.m3u8`,
        };
        await this.errorsValidation(StreamDTO, data, files.file[0]);
        const result = await this.streamService.createStream(data);
        const basePath = `./uploads/stream/file/${files.file[0].filename
          .split('.')
          .slice(0, -1)
          .join('.')}`;
        fs.mkdirSync(basePath, { recursive: true });
        fs.rename(
          files.file[0].path,
          `${basePath}/${files.file[0].filename}`,
          (err) => {
            if (err) {
              throw err;
            }
          },
        );
        // const fileProcess: JobInterface = {
        //   inputPath: `./uploads/stream/file/${files.file[0].filename
        //     .split('.')
        //     .slice(0, -1)
        //     .join('.')}/${files.file[0].filename}`,
        //   outputPath: basePath,
        // };
        // const x = await this.videouploadQueue.add('transcode', fileProcess);
        return res.status(201).send(
          this.responseMessage('stream', 'Create', 201, {
            result,
          }),
        );
      }
      if (!files.file && !files.thumbnail) {
        throw new BadRequestException('Image and Video is required!');
      }
      if (files.thumbnail && !files.file) {
        this.validateSingleImage(files.thumbnail[0]);
        unlinkSync(files.thumbnail[0].path);
        console.log(files);
        throw new BadRequestException('Video is required!');
      }
      if (files.file && !files.thumbnail) {
        this.validateVideo(files.file[0]);
        unlinkSync(files.file[0].path);
        throw new BadRequestException('Image is required!');
      }
    } catch (error) {
      throw error;
    }
  }

  //Update Stream
  @Put('/:uuid')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          filename: (req, file, cb) => {
            const randomNameFile =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extensionFile = extname(file.originalname);
            const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
            cb(null, fileName);
          },
          destination: (req, file, cb) => {
            let destination: any;
            if (file.fieldname === 'file') {
              destination = './uploads/stream/file';
            } else if (file.fieldname === 'thumbnail') {
              destination = './uploads/stream/thumbnail';
            }
            cb(null, destination);
          },
        }),
      },
    ),
  )
  async updateStream(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @UploadedFiles()
    files: {
      file: Express.Multer.File;
      thumbnail: Express.Multer.File;
    },
  ): Promise<Response<any, Record<string, any>>> {
    try {
      if (files.file && files.thumbnail) {
        try {
          this.isValidUUID(uuid);
          this.validateVideo(files.file[0]);
          this.validateSingleImage(files.thumbnail[0]);
          const data: StreamDTO = {
            talkCategoryId: Number(dto.talkCategoryId),
            title: dto.title,
            description: dto.description,
            personalNumber: dto.personalNumber,
            createdBy: dto.createdBy,
            unit: dto.unit,
            thumbnail: files.thumbnail[0].filename,
            pathThumbnail: `stream/thumbnail/${files.thumbnail[0].filename}`,
            video: files.file[0].filename.split('.').slice(0, -1).join('.'),
            pathVideo: `${files.file[0].path
              .replace('uploads/', '')
              .split('.')
              .slice(0, -1)
              .join('.')}/${files.file[0].filename}/transcodeMP4.m3u8`,
          };
          await this.errorsValidation(StreamDTO, data, files.file[0]);
          const result = await this.streamService.updateStream(uuid, data);
          const basePath = `./uploads/stream/file/${files.file[0].filename
            .split('.')
            .slice(0, -1)
            .join('.')}`;
          fs.mkdirSync(basePath, { recursive: true });
          fs.rename(
            files.file[0].path,
            `${basePath}/${files.file[0].filename}`,
            (err) => {
              if (err) {
                throw err;
              }
            },
          );
          // const fileProcess: JobInterface = {
          //   inputPath: `./uploads/stream/file/${files.file[0].filename
          //     .split('.')
          //     .slice(0, -1)
          //     .join('.')}/${files.file[0].filename}`,
          //   outputPath: basePath,
          // };

          // await this.videouploadQueue.add('transcode', fileProcess);
          return res
            .status(201)
            .send(this.responseMessage('stream', 'Update', 200, result));
        } catch (error) {
          throw error;
        }
      }
      if (!files.file && !files.thumbnail) {
        throw new BadRequestException('Image and Video is required!');
      }
      if (files.thumbnail && !files.file) {
        this.validateSingleImage(files.thumbnail[0]);
        unlinkSync(files.thumbnail[0].path);
        console.log(files);
        throw new BadRequestException('Video is required!');
      }
      if (files.file && !files.thumbnail) {
        this.validateVideo(files.file[0]);
        unlinkSync(files.file[0].path);
        throw new BadRequestException('Image is required!');
      }
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:uuid')
  async deleteStream(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    const result = await this.streamService.deleteStream(uuid);
    return res
      .status(200)
      .send(this.responseMessage('stream', 'Delete', 200, result));
  }

  //Add Favorite
  @Post('/add-favorite')
  async addFavorite(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: FavoriteDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.errorsValidation(FavoriteDTO, dto);
      const result = await this.streamService.addFavorite(dto);
      return res
        .status(201)
        .send(this.responseMessage('stream favorite', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Favorite
  @Delete('/delete-favorite/:personalNumber')
  async deleteFavorite(
    @Res() res: Response<any, Record<string, any>>,
    @Param('personalNumber') personalNumber: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(personalNumber);
      const result = await this.streamService.deleteFavorite(personalNumber);
      return res
        .status(200)
        .send(this.responseMessage('stream favorite', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Add Watch
  @Post('/add-watch')
  async addWatch(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: FavoriteDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.streamService.addWatchStream(dto);
      return res
        .status(201)
        .send(this.responseMessage('watch stream', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Stream Status
  @Put('/status/:uuid')
  async updateStreamStatus(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: StreamStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(StreamStatusDTO, dto);
      const result = await this.streamService.updateStreamStatus(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('Stream', 'Update Status', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Stream Status Approval
  @Put('/status-approval/:uuid')
  async updateStreamStatusApproval(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: StreamStatusApprovalDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(StreamStatusApprovalDTO, dto);
      const result = await this.streamService.updateStreamStatusApproval(
        uuid,
        dto,
      );

      await this.checkPoint(
        'Create Stream',
        result.personalNumber,
        dto.approvalStatus === 'Approved' ? true : false,
      );

      return res
        .status(200)
        .send(
          this.responseMessage('Stream', 'Update Approval Status', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Update Stream Editor Choice
  @Put('/editor-choice/:uuid')
  async updateStreamEditorChoice(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: StreamEditorChoiceDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(StreamEditorChoiceDTO, dto);
      const result = await this.streamService.updateStreamEditorChoice(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('Stream', 'Update Editor Choice', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }
}
