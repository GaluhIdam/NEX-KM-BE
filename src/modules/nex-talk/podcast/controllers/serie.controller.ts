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
import { SerieControllerInterface } from '../interfaces/serie.controller.interface';
import { SerieService } from '../services/serie.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SerieDTO } from '../dtos/serie.dto';
import { SerieStatusDTO } from '../dtos/serie-status.dto';
import { SerieStatusApprovalDTO } from '../dtos/serie-status-approval.dto';
import { SerieEditorChoiceDTO } from '../dtos/serie-editor-choice.dto';

@Controller({ path: 'api/serie', version: '1' })
// @Resource(SeriesController.name)
export class SerieController
  extends BaseController
  implements SerieControllerInterface
{
  constructor(private readonly serieService: SerieService) {
    super(SerieController.name);
  }

  //Get Series
  @Get()
  async getSeries(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('order_by') order_by?: string,
    @Query('personal_number') personal_number?: string,
    @Query('status') status?: string,
    @Query('creator_id') creator_id?: string,
    @Query('approval_status') approval_status?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);

      let isActive = null;

      if (status) {
        isActive = this.validationBooleanParams(status);
      }
      const series = await this.serieService.getSeries(
        page,
        limit,
        search,
        order_by,
        personal_number,
        isActive,
        Number(creator_id),
        approval_status,
      );
      return res
        .status(200)
        .send(this.responseMessage('series', 'Get', 200, series));
    } catch (error) {
      throw error;
    }
  }

  //Get Serie Statistic
  @Get('/statistic')
  async getSerieStatistic(
    @Res() res: Response<any, Record<string, any>>,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const series = await this.serieService.getSerieStatistic();
      return res
        .status(200)
        .send(this.responseMessage('Serie Statistic', 'Get', 200, series));
    } catch (error) {
      throw error;
    }
  }

  //Get Serie By Uuid
  @Get('/:uuid')
  async getSerieByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const serie = await this.serieService.getSerieByUuid(uuid);
      return res
        .status(200)
        .send(this.responseMessage('Serie', 'Get by Id', 200, serie));
    } catch (error) {
      throw error;
    }
  }

  //Create Serie
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/podcast/series',
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
  async createSeries(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: SerieDTO = {
        creatorId: Number(dto.creatorId),
        title: dto.title,
        description: dto.description,
        image: image.filename,
        path: `podcast/series/${image.filename}`,
        personalNumber: dto.personalNumber,
      };
      await this.errorsValidation(SerieDTO, data, image);
      const series = await this.serieService.createSeries(data);
      return res
        .status(201)
        .send(this.responseMessage('series', 'Create', 201, series));
    } catch (error) {
      throw error;
    }
  }

  //Update Series
  @Put('/:uuid')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/podcast/series',
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
  async updateSeries(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: SerieDTO = {
        creatorId: Number(dto.creatorId),
        title: dto.title,
        description: dto.description,
        image: image.filename,
        path: `podcast/series/${image.filename}`,
        personalNumber: dto.personalNumber,
      };
      await this.errorsValidation(SerieDTO, data, image);
      const series = await this.serieService.updateSeries(uuid, data);
      return res
        .status(200)
        .send(this.responseMessage('series', 'Update', 200, series));
    } catch (error) {
      throw error;
    }
  }

  //Delete Series
  @Delete('/:uuid')
  async deleteSeries(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const series = await this.serieService.deleteSeries(uuid);
      return res
        .status(200)
        .send(this.responseMessage('series', 'Delete', 200, series));
    } catch (error) {
      throw error;
    }
  }

  //Update Serie Status
  @Put('/status/:uuid')
  async updateSerieStatus(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: SerieStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(SerieStatusDTO, dto);
      const result = await this.serieService.updateSerieStatus(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('Serie', 'Update Status', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Serie Status Approval
  @Put('/status-approval/:uuid')
  async updateSerieStatusApproval(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: SerieStatusApprovalDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(SerieStatusApprovalDTO, dto);
      const result = await this.serieService.updateSerieStatusApproval(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('Serie', 'Update Approval Status', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Update Serie Editor Choice
  @Put('/editor-choice/:uuid')
  async updateSerieEditorChoice(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: SerieEditorChoiceDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(SerieEditorChoiceDTO, dto);
      const result = await this.serieService.updateSerieEditorChoice(uuid, dto);
      return res
        .status(200)
        .send(
          this.responseMessage('Serie', 'Update Editor Choice', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }
}
