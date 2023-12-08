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
import { Response } from 'express';
import { BaseController } from 'src/core/controllers/base.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MerchandiseService } from '../services/merchandise.service';
import {
  GetUsersQueryDTO,
  MerchandiseDTO,
  MerchandiseImageDTO,
  PinUnpinDTO,
} from '../dtos/merchandise.dto';
import { MerchandiseControllerInterface } from '../interface/merchandise.controller.interface';

@Controller({ path: 'api/merchandise', version: '1' })
export class MerchandiseController
  extends BaseController
  implements MerchandiseControllerInterface {
  constructor(private readonly merchandiseService: MerchandiseService) {
    super(MerchandiseController.name);
  }

  @Get('search')
  async searchUseElastic(
    @Res() res: Response<Record<string, any>>,
    @Query('q') query: string,
  ): Promise<Response<Record<string, any>>> {
    try {
      const result = await this.merchandiseService.searchMerchandise(query);

      return res
        .status(200)
        .send(this.responseMessage('merchandise', 'Search', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Filter Merchandise
  @Get('filter')
  async filterMerchandise(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('minPoint') minPoint: number,
    @Query('maxPoint') maxPoint: number,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      if (minPoint > maxPoint) {
        throw new Error("Min point can't be greater than Max Point");
      }
      this.validatePageLimit(page, limit);
      const result = await this.merchandiseService.filterMerchandise(
        page,
        limit,
        search,
        minPoint,
        maxPoint,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('Merchandise', 'Filtering', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Getting Merchandise Data
  @Get()
  async getMerchandise(
    @Res() res: Response<any, Record<string, any>>,
    @Query() queryParams: GetUsersQueryDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(queryParams.page, queryParams.limit);
      const result = await this.merchandiseService.getMerchandise(queryParams);
      return res
        .status(200)
        .send(this.responseMessage('Merchandise', 'Getting', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Getting Merchandise Data By Uuid
  @Get(':uuid')
  async getMerchandiseByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    this.isValidUUID(uuid);
    const result = await this.merchandiseService.getMerchandiseByUuid(uuid);
    return res
      .status(200)
      .send(this.responseMessage('Merchandise', 'Get', 200, result));
  }

  //Create Merchandise
  @Post()
  async createMerchandise(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: MerchandiseDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const data: MerchandiseDTO = {
        personalNumber: String(dto.personalNumber),
        title: dto.title,
        description: dto.description,
        qty: Number(dto.qty),
        point: Number(dto.point),
        isPinned: Boolean(dto.isPinned),
      };
      await this.errorsValidation(MerchandiseDTO, data);
      const result = await this.merchandiseService.createMerchandise(data);
      return res
        .status(201)
        .send(this.responseMessage('Merchandise', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Merchandise
  @Put(':uuid')
  async updateMerchandise(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: MerchandiseDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const data: MerchandiseDTO = {
        personalNumber: dto.personalNumber,
        title: dto.title,
        description: dto.description,
        qty: Number(dto.qty),
        point: Number(dto.point),
        isPinned: dto.isPinned,
      };
      await this.errorsValidation(MerchandiseDTO, data);
      const result = await this.merchandiseService.updateMerchandiseByUUID(
        uuid,
        data,
      );
      return res
        .status(200)
        .send(this.responseMessage('Merchandise', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Pin or Unpin
  @Put('/pin-unpin/:uuid')
  async pinUnpin(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: PinUnpinDTO,
  ): Promise<Response<any, Record<string, any>>> {
    this.isValidUUID(uuid);
    const result = await this.merchandiseService.pinUnpin(uuid, dto);
    return res
      .status(200)
      .send(this.responseMessage('Merchandise', 'Pin/Unpin', 200, result));
  }

  //Delete Merchandise
  @Delete(':uuid')
  async deleteMerchandise(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.merchandiseService.deleteMerchandiseByUUID(
        uuid,
      );
      return res
        .status(200)
        .send(this.responseMessage('merchandise', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Image Merchandise
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/level/merchandise',
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
  async createImageMerchandise(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: MerchandiseImageDTO = {
        personalNumber: dto.personalNumber,
        merchandiseId: Number(dto.merchandiseId),
        image: image.filename,
        path: `level/merchandise/${image.filename}`,
      };
      await this.errorsValidation(MerchandiseImageDTO, data, image);
      const result = await this.merchandiseService.createImageMerchandise(data);
      return res
        .status(201)
        .send(this.responseMessage('image merchandise', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Image Merchandise
  @Post('image-update')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/level/merchandise',
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
  async updateImageMerchandise(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: MerchandiseImageDTO = {
        personalNumber: dto.personalNumber,
        merchandiseId: Number(dto.merchandiseId),
        image: image.filename,
        path: `level/merchandise/${image.filename}`,
      };
      await this.errorsValidation(MerchandiseImageDTO, data, image);
      const result = await this.merchandiseService.updateImageMerchandise(data);
      return res
        .status(200)
        .send(this.responseMessage('image merchandise', 'Update', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Image Merchandise
  @Delete('image/:uuid')
  async deleteImageMerchandise(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.merchandiseService.deleteMerchandiseImage(uuid);
      return res
        .status(200)
        .send(this.responseMessage('image merchandise', 'delete', 201, result));
    } catch (error) {
      throw error;
    }
  }
}
