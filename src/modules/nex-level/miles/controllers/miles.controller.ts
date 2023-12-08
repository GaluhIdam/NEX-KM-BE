import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { MilesService } from '../services/miles.service';
import { MilesDTO } from '../dtos/miles.dto';
import { MilesControllerInterface } from '../interface/miles.controller.interface';
import { BaseController } from 'src/core/controllers/base.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller({ path: 'api/miles', version: '1' })
export class MilesController
  extends BaseController
  implements MilesControllerInterface
{
  constructor(private readonly milesService: MilesService) {
    super(MilesController.name);
  }

  @Get('all')
  async getAllMile(
    @Res() res: Response<any, Record<string, any>>,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.milesService.getAllMiles();
      return res
        .status(200)
        .send(this.responseMessage('miles', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Get(':uuid')
  async getMilesByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.milesService.getMilesByUuid(uuid);
      return res
        .status(200)
        .send(this.responseMessage('miles', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getMiles(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.milesService.getMiles(
        page,
        limit,
        search,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('mile', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/level/mile',
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
  async createMiles(
    @Res() res: Response<any, Record<string, any>>,
    @Body() data: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const dto: MilesDTO = {
        level: data.level,
        category: data.category,
        name: data.name,
        image: image.filename,
        minPoint: Number(data.minPoint),
        maxPoint: Number(data.maxPoint),
        path: `level/mile/${image.filename}`,
        personalNumber: data.personalNumber,
        status: data.status === 'true' ? true : false,
      };
      await this.errorsValidation(MilesDTO, dto, image);
      const result = await this.milesService.createMiles(dto);
      return res
        .status(201)
        .send(this.responseMessage('miles', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  @Put('/:uuid')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/level/mile',
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
  async updateMiles(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() data: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const dto: MilesDTO = {
        level: data.level,
        category: data.category,
        name: data.name,
        image: image.filename,
        minPoint: Number(data.minPoint),
        maxPoint: Number(data.maxPoint),
        path: `level/mile/${image.filename}`,
        personalNumber: data.personalNumber,
        status: data.status === 'true' ? true : false,
      };

      await this.errorsValidation(MilesDTO, dto, image);
      const result = await this.milesService.updateMilesByUUID(uuid, dto);

      return res
        .status(200)
        .send(this.responseMessage('miles', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Delete(':uuid')
  async deleteMiles(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.milesService.deleteMilesByUUID(uuid);
      return res
        .status(200)
        .send(this.responseMessage('miles', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
