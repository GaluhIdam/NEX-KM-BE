import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommunityControllerInterface } from '../interface/community.controller.interface';
import { Response } from 'express';
import {
  CommunityPublishDTO,
  FileImageDTO,
  PublishPrivateDTO,
} from '../dtos/community.dto';
import { CommunityService } from '../services/community.service';
import { BaseController } from 'src/core/controllers/base.controller';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SortResults } from '@elastic/elasticsearch/lib/api/types';

@Controller({ path: 'api/community', version: '1' })
export class CommunityController
  extends BaseController
  implements CommunityControllerInterface
{
  constructor(private readonly communityService: CommunityService) {
    super(CommunityController.name);
  }

  @Get('search')
  async search(
    @Res() res: Response,
    @Query('q') query: string,
    @Body('prevSort') prevSort: SortResults,
  ): Promise<Response<Record<string, any>>> {
    try {
      const result = await this.communityService.search(query, prevSort);

      return res
        .status(200)
        .send(this.responseMessage('community', 'search', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Community
  @Get()
  async getCommunity(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('isAdmin') isAdmin: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.communityService.getCommunity(
        page,
        limit,
        search,
        sortBy,
        isAdmin,
      );
      return res
        .status(200)
        .send(this.responseMessage('community', 'Geting data', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Get('/:uuid')
  async getCommunityById(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(uuid);
      const result = await this.communityService.getCommunityById(uuid);
      return res
        .status(200)
        .send(
          this.responseMessage('community', 'Getting data by id', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnailPhotoFile', maxCount: 1 },
        { name: 'headlinePhotoFile', maxCount: 1 },
        { name: 'iconFile', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            let destination: any;
            if (file.fieldname === 'thumbnailPhotoFile') {
              destination = './uploads/community/thumbnail';
            } else if (file.fieldname === 'headlinePhotoFile') {
              destination = './uploads/community/headline';
            } else if (file.fieldname === 'iconFile') {
              destination = './uploads/community/icon';
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
  async createCommunity(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: CommunityPublishDTO,
    @UploadedFiles() image: FileImageDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateDualImage(image.headlinePhotoFile, image.thumbnailPhotoFile);
      await this.errorsValidation(
        CommunityPublishDTO,
        dto,
        image.headlinePhotoFile,
        image.thumbnailPhotoFile,
      );
      const result = await this.communityService.createCommunity(dto, image);
      return res
        .status(200)
        .send(this.responseMessage('community', 'Create', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Community
  @Put('/:uuid')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnailPhotoFile', maxCount: 1 },
        { name: 'headlinePhotoFile', maxCount: 1 },
        { name: 'iconFile', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            let destination: any;
            if (file.fieldname === 'thumbnailPhotoFile') {
              destination = './uploads/community/thumbnail';
            } else if (file.fieldname === 'headlinePhotoFile') {
              destination = './uploads/community/headline';
            } else if (file.fieldname === 'iconFile') {
              destination = './uploads/community/icon';
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
  async updateCommunity(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() data: CommunityPublishDTO,
    @UploadedFiles() image: FileImageDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      this.validateDualImage(image.headlinePhotoFile, image.thumbnailPhotoFile);
      await this.errorsValidation(
        CommunityPublishDTO,
        data,
        image.headlinePhotoFile,
        image.thumbnailPhotoFile,
      );
      const result = await this.communityService.updateCommunity(
        uuid,
        data,
        image,
      );
      return res
        .status(200)
        .send(this.responseMessage('community', 'Create', 200, result));
    } catch (error) {
      throw error;
    }
  }

  deleteCommunity(
    res: Response<any, Record<string, any>>,
    uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    throw new Error('Method not implemented.');
  }

  //Private or Publish
  @Put('/publish-private/:uuid')
  async publishPrivate(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: PublishPrivateDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.communityService.publishPrivate(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('community', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Ban Community
  @Put('/ban-community/:uuid')
  async banCommunity(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: PublishPrivateDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.communityService.banCommunity(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('community', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
