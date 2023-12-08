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
} from '@nestjs/common';
import { Response } from 'express';
import { PointConfigControllerInterface } from '../interface/point-config.controller.interface';
import { PointConfigService } from '../services/point-config.service';
import { BaseController } from 'src/core/controllers/base.controller';
import { PointConfigDTO } from '../dtos/point-config.dto';

@Controller({ path: 'api/point-config', version: '1' })
export class PointConfigController
  extends BaseController
  implements PointConfigControllerInterface
{
  constructor(private readonly pointConfigService: PointConfigService) {
    super(PointConfigController.name);
  }

  @Get(':uuid')
  async getPointConfigByUUID(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.pointConfigService.getPointConfigByUUID(uuid);
      return res
        .status(200)
        .send(this.responseMessage('point config', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getPointConfig(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.pointConfigService.getPointConfig(
        page,
        limit,
        search,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('point config', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createPointConfig(
    @Res() res: Response<any, Record<string, any>>,
    @Body() data: PointConfigDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.pointConfigService.createPointConfig(data);
      return res
        .status(201)
        .send(this.responseMessage('point config', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  @Put(':uuid')
  async updatePointConfig(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() data: PointConfigDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.pointConfigService.updatePointConfigByUUID(
        uuid,
        data,
      );
      return res
        .status(200)
        .send(this.responseMessage('point config', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:uuid')
  async deletePointConfig(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.pointConfigService.deletePointConfigByUUID(
        uuid,
      );
      return res
        .status(200)
        .send(this.responseMessage('point config', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
