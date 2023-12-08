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
import { SliderControllerInterface } from '../interfaces/slider.controller.interface';
import { Response } from 'express';
import { SliderService } from '../services/slider.service';
import { BaseController } from 'src/core/controllers/base.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SliderDTO } from '../dtos/slider.dto';

@Controller({ path: 'api/sliders', version: '1' })
export class SliderController
  extends BaseController
  implements SliderControllerInterface
{
  constructor(private readonly sliderService: SliderService) {
    super(SliderController.name);
  }

  //Get Slider By Uuid
  @Get(':uuid')
  async getSliderByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.sliderService.getSliderByUuid(uuid);
      return res
        .status(200)
        .send(this.responseMessage('sliders', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Slider
  @Get()
  async getSlider(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('isAdmin') isAdmin: boolean,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.sliderService.getSlider(
        page,
        limit,
        search,
        sortBy,
        isAdmin,
      );
      return res
        .status(200)
        .send(this.responseMessage('sliders', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Slider
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/sliders/image',
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
  async createSlider(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: SliderDTO = {
        personalNumber: dto.personalNumber,
        title: dto.title,
        description: dto.description,
        backgroundImage: `sliders/image/${image.filename}`,
        sequence: Number(dto.sequence),
        uploadedBy: dto.uploadedBy,
        status: dto.status === 'false' ? false : true,
      };
      await this.errorsValidation(SliderDTO, data, image);
      const result = await this.sliderService.createSlider(data);
      return res
        .status(201)
        .send(this.responseMessage('slider', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Slider
  @Put(':uuid')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/sliders/image',
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
  async updateSlider(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: SliderDTO = {
        personalNumber: dto.personalNumber,
        title: dto.title,
        description: dto.description,
        backgroundImage: `sliders/image/${image.filename}`,
        sequence: Number(dto.sequence),
        uploadedBy: dto.uploadedBy,
        status: dto.status === 'false' ? false : true,
      };
      await this.errorsValidation(SliderDTO, data, image);
      const result = await this.sliderService.updateSlider(uuid, data);
      return res
        .status(200)
        .send(this.responseMessage('slider', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Slider
  @Delete(':uuid')
  async deleteSlider(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.sliderService.deleteSlider(uuid);
      return res
        .status(200)
        .send(this.responseMessage('slider', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
