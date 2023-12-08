import {
  Body,
  Controller,
  Query,
  Res,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { AlbumControllerInterface } from '../interfaces/album.controller.interface';
import { AlbumService } from '../services/album.service';
import { AlbumDTO } from '../dtos/album.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BaseController } from 'src/core/controllers/base.controller';
import { AlbumGalleryService } from '../services/album-gallery.service';
import { AlbumStatusDTO } from '../dtos/album-status.dto';
import { AlbumStatusApprovalDTO } from '../dtos/album-status-approval.dto';

@Controller({ path: 'api/album', version: '1' })
export class AlbumController
  extends BaseController
  implements AlbumControllerInterface {
  constructor(
    private readonly albumService: AlbumService,
    private readonly albumgalleryService: AlbumGalleryService,
  ) {
    super(AlbumController.name);
  }

  @Get('search')
  async search(
    @Res() res: Response,
    @Query('q') query: string,
  ): Promise<Response<Record<string, any>>> {
    try {
      const result = await this.albumService.search(query);

      return res
        .status(200)
        .send(this.responseMessage('album', 'Search', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Album
  @Get()
  async getAlbum(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('id_album_category') id_album_category?: number,
    @Query('personalNumber') personalNumber?: string,
    @Query('sortBy') sortBy?: string,
    @Query('status') status?: string,
    @Query('approval_status') approvalStatus?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);

      let isActive = null;

      if (status) {
        isActive = this.validationBooleanParams(status);
      }

      const result = await this.albumService.getAlbum(
        page,
        limit,
        search,
        id_album_category,
        personalNumber,
        sortBy,
        isActive,
        approvalStatus,
      );
      return res
        .status(200)
        .send(this.responseMessage('album', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Album By Id
  @Get('/:id_album')
  async getAlbumById(
    @Res() res: Response<any, Record<string, any>>,
    @Param('id_album') id_album: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(id_album);
      const result = await this.albumService.getAlbumById(id_album);
      return res
        .status(200)
        .send(this.responseMessage('album', 'Get by Id', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Album by Personal Number
  @Get('by-personal-number/:personal_number')
  async getAlbumByPersonalNumber(
    @Res() res: Response<any, Record<string, any>>,
    @Param('personal_number') personal_number: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(personal_number);
      this.validatePageLimit(page, limit);
      const result = await this.albumService.getAlbumByPersonalNumber(
        personal_number,
        page,
        limit,
        search,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('album', 'Get by personal number', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Create Album
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/album/cover',
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
  async createAlbum(
    @Res() res: Response<any, Record<string, any>>,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: any,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      await this.checkPoint('Create Album', dto.personalNumber, dto.status);
      const data: AlbumDTO = {
        categoryAlbum: Number(dto.categoryAlbum),
        title: dto.title,
        description: dto.description,
        upload_by: dto.upload_by,
        unit: dto.unit,
        album_cover: image.filename,
        path: `album/cover/${image.filename}`,
        size: image.size,
        mimeType: image.mimetype,
        personalNumber: dto.personalNumber,
      };
      await this.errorsValidation(AlbumDTO, data, image);
      const result = await this.albumService.createAlbum(data);
      return res
        .status(201)
        .send(this.responseMessage('album', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Album (General)
  @Put('/:uuid')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/album/cover',
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
  async updateAlbum(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      this.validateSingleImage(image);
      const data: AlbumDTO = {
        categoryAlbum: Number(dto.categoryAlbum),
        title: dto.title,
        description: dto.description,
        personalNumber: dto.personalNumber,
        upload_by: dto.upload_by,
        unit: dto.unit,
        album_cover: image.filename,
        path: `.album/cover/${image.filename}`,
        size: image.size,
        mimeType: image.mimetype,
      };
      await this.errorsValidation(AlbumController, data, image);
      const result = await this.albumService.updateAlbum(uuid, data);
      return res
        .status(200)
        .send(this.responseMessage('album', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Album Status
  @Put('/status/:uuid')
  async updateAlbumStatus(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: AlbumStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(AlbumStatusDTO, dto);
      const result = await this.albumService.updateAlbumStatus(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('Album', 'Update Status', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Album Status Approval
  @Put('/status-approval/:uuid')
  async updateAlbumStatusApproval(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: AlbumStatusApprovalDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(AlbumStatusApprovalDTO, dto);

      const result = await this.albumService.updateAlbumStatusApproval(
        uuid,
        dto,
      );

      await this.checkPoint(
        'Create Album',
        result.personalNumber,
        dto.approvalStatus === 'Approved' ? true : false,
      );

      return res
        .status(200)
        .send(
          this.responseMessage('Album', 'Update Approval Status', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Delete Album
  @Delete('/:uuid')
  async deleteAlbum(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const findDataAlbum = await this.albumService.getAlbumById(uuid);
      await this.albumgalleryService.getAlbumGalleryByAlbumId(findDataAlbum.id);
      const result = await this.albumService.deleteAlbum(uuid);
      return res
        .status(200)
        .send(this.responseMessage('album', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
