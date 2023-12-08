import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { AlbumGalleryService } from '../services/album-gallery.service';
import { AlbumGalleryControllerInterface } from '../interfaces/album-gallery.controller.interface';
import { AlbumGalleryDTO } from '../dtos/album-gallery.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlinkSync } from 'fs';
import { BaseController } from 'src/core/controllers/base.controller';
import { AlbumService } from '../services/album.service';

@Controller({ path: 'api/album-gallery', version: '1' })
export class AlbumGalleryController
  extends BaseController
  implements AlbumGalleryControllerInterface
{
  constructor(
    private readonly albumgalleryService: AlbumGalleryService,
    private readonly albumService: AlbumService,
  ) {
    super(AlbumGalleryController.name);
  }

  //Get Album Gallery
  @Get()
  async getAlbumGallery(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.albumgalleryService.getAlbumGallery(
        page,
        limit,
      );
      return res
        .status(200)
        .send(this.responseMessage('album gallery', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Get('/album/:id_album')
  async getAlbumGalleryPaginateByAlbumIdå(
    @Res() res: Response<any, Record<string, any>>,
    @Param('id_album') id_album: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(id_album);
      this.validatePageLimit(page, limit);
      const result =
        await this.albumgalleryService.getAlbumGalleryPaginateByAlbumId(
          Number(id_album),
          page,
          limit,
        );
      return res
        .status(200)
        .send(
          this.responseMessage('album gallery', 'Get By Album Id', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Post Album Gallery
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/album/album-gallery',
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
  async createAlbumGallery(
    @Res() res: Response<any, Record<string, any>>,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: any,
  ): Promise<Response<Record<string, any>>> {
    try {
      this.validateMutipleImage(images);
      const checkData = images.map(
        async (data: Express.Multer.File, i: number) => {
          const albumGalleryDto: AlbumGalleryDTO = {
            albumId:
              req.body.id_album.length > 0
                ? Number(req.body.id_album[i])
                : Number(req.body.id_album),
            name: req.body.name,
            images: data.filename,
            path: `album/album-gallery/${data.filename}`,
            size: data.size,
            mimeType: data.mimetype,
            personalNumber: req.body.personalNumber,
          };
          await this.errorsValidation(
            AlbumGalleryDTO,
            albumGalleryDto,
            data[i],
          );
          const insertData = await this.albumgalleryService.createAlbumGallery(
            albumGalleryDto,
          );
          return insertData;
        },
      );
      const results = await Promise.all(checkData);
      return res
        .status(201)
        .send(this.responseMessage('album gallery', 'Create', 201, results));
    } catch (error) {
      throw error;
    }
  }

  //Update Album Gallery
  @Put()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/album/album-gallery',
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
  async updateAlbumGallery(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: any,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateMutipleImage(images);
      this.validateMultipleDataImage(dto.uuid, images);
      const promises = dto.uuid.map(async (id: any, i: any) => {
        const finddata = await this.albumgalleryService.getAlbumGalleryById(id);
        unlinkSync(`./uploads/album/album-gallery/${finddata.name}`);
        const albumGalleryDto: AlbumGalleryDTO = {
          albumId: Number(finddata.albumId),
          name: images[i].filename,
          images: images[i].filename,
          path: `album/album-gallery/${images[i].filename}`,
          size: images[i].size,
          mimeType: images[i].mimetype,
          personalNumber: dto.personalNumber,
        };
        const updateData = await this.albumgalleryService.updateAlbumGallery(
          id,
          albumGalleryDto,
        );
        return updateData;
      });
      const results = await Promise.all(promises);
      const flattenedResults = results.flat();
      return res
        .status(200)
        .send(
          this.responseMessage(
            'album gallery',
            'Update',
            200,
            flattenedResults,
          ),
        );
    } catch (error) {
      images.forEach((data) => {
        unlinkSync(`./uploads/album/album-gallery/${data.filename}`);
      });
      throw error;
    }
  }

  @Delete()
  async deleteAlbumGallery(
    @Res() res: Response<any, Record<string, any>>,
    @Req() req: any,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      if (req.body.uuid.length === 1) {
        const finddata = await this.albumgalleryService.getAlbumGalleryById(
          req.body.uuid[0],
        );
        unlinkSync(`./uploads/${finddata.path}`);
        const results = await this.albumgalleryService.deleteAlbumGallery(
          req.body.uuid[0],
        );
        return res.status(200).send(results);
      }
      if (req.body.uuid.length > 1) {
        const promises = req.body.uuid.map(async (id: string, i: any) => {
          const finddata = await this.albumgalleryService.getAlbumGalleryById(
            id,
          );
          unlinkSync(`./uploads/album/album-gallery/${finddata.name}`);
          const deleteData = await this.albumgalleryService.deleteAlbumGallery(
            id,
          );
          return deleteData;
        });
        const results = await Promise.all(promises);
        const flattenedResults = results.flat();
        return res
          .status(200)
          .send(
            this.responseMessage(
              'album gallery',
              'Delete',
              200,
              flattenedResults,
            ),
          );
      }
    } catch (error) {
      throw error;
    }
  }
}
