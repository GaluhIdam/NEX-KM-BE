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
import { WebDirectoryControllerInterface } from '../interfaces/web-directory.controller.interface';
import { WebDirectoryService } from '../services/web-directory.service';
import { Response } from 'express';
import { WebDirectoryDTO } from '../dtos/web-directory.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlinkSync } from 'fs';
import { UnitDinasService } from '../services/unit-dinas.service';
import { WebDirectoryStatusDTO } from '../dtos/web-directory-status.dto';

@Controller({ path: 'api/web-directory', version: '1' })
export class WebDirectoryController
  extends BaseController
  implements WebDirectoryControllerInterface
{
  constructor(
    private readonly webdirectoryService: WebDirectoryService,
    private readonly unitdinasService: UnitDinasService,
  ) {
    super(WebDirectoryController.name);
  }

  //Get Web Direvtory
  @Get()
  async getWebDirectory(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('id_unit') id_unit?: number,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('personalNumber') personalNumber?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);

      let isActive = null;

      if (status) {
        isActive = this.validationBooleanParams(status);
      }

      const result = await this.webdirectoryService.getWebDirectory(
        page,
        limit,
        search,
        id_unit,
        isActive,
        sortBy,
        personalNumber,
      );
      return res
        .status(200)
        .send(this.responseMessage('web directory', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Web Directory By Id
  @Get('/:uuid')
  async getWebDirectoryById(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.webdirectoryService.getWebDirectoryById(uuid);
      return res
        .status(200)
        .send(this.responseMessage('web directory', 'Get by Id', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Web Directory
  @Post()
  @UseInterceptors(
    FileInterceptor('cover_image', {
      storage: diskStorage({
        destination: './uploads/web-directory/cover',
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
  async createWebDirectory(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: any,
    @UploadedFile() cover_image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(cover_image);
      await this.checkPoint('Create Web Directory', dto.personalNumber, true);
      const data: WebDirectoryDTO = {
        title: dto.title,
        description: dto.description,
        cover: cover_image.filename,
        link: dto.link,
        path: `web-directory/cover/${cover_image.filename}`,
        personalNumber: dto.personalNumber,
        id_unit_dinas: Number(dto.id_unit_dinas),
      };
      await this.errorsValidation(WebDirectoryDTO, data, cover_image);
      try {
        await this.unitdinasService.getUnitDinasByPK(data.id_unit_dinas);
      } catch (error) {
        unlinkSync(cover_image.path);
        throw error;
      }
      const result = await this.webdirectoryService.createWebDirectory(data);
      return res
        .status(201)
        .send(this.responseMessage('web directory', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Web Directory
  @Put('/:uuid')
  @UseInterceptors(
    FileInterceptor('cover_image', {
      storage: diskStorage({
        destination: './uploads/web-directory/cover',
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
  async updateWebDirectory(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @UploadedFile() cover_image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      this.validateSingleImage(cover_image);
      const data: WebDirectoryDTO = {
        title: dto.title,
        description: dto.description,
        cover: cover_image.filename,
        link: dto.link,
        path: `web-directory/cover/${cover_image.filename}`,
        personalNumber: dto.personalNumber,
        id_unit_dinas: Number(dto.id_unit_dinas),
      };
      await this.errorsValidation(WebDirectoryDTO, data, cover_image);
      try {
        await this.unitdinasService.getUnitDinasByPK(data.id_unit_dinas);
      } catch (error) {
        unlinkSync(cover_image.path);
        throw error;
      }
      try {
        await this.webdirectoryService.getWebDirectoryById(uuid);
      } catch (error) {
        unlinkSync(cover_image.path);
        throw error;
      }
      const result = await this.webdirectoryService.updateWebDirectory(
        uuid,
        data,
      );
      return res
        .status(200)
        .send(this.responseMessage('web directory', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Web Directory Status
  @Put('/status/:uuid')
  async updateWebDirectoryStatus(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: WebDirectoryStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(WebDirectoryStatusDTO, dto);
      const result = await this.webdirectoryService.updateWebDirectoryStatus(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('Web Directory', 'Update Status', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Delete Web Directroy
  @Delete('/:uuid')
  async deleteWebDirectory(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.webdirectoryService.deleteWebDirectory(uuid);
      return res
        .status(200)
        .send(this.responseMessage('web directory', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
