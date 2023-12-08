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
  ServiceUnavailableException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AlbumCategoryControllerInterface } from '../interfaces/album-category.controller.interface';
import { AlbumCategoryService } from '../services/album-category.service';
import { Response } from 'express';
import { AlbumCategoryDTO } from '../dtos/album-category.dto';
import { BaseController } from 'src/core/controllers/base.controller';
import { AlbumCategoryStatusDTO } from '../dtos/album-category-status.dto';

@Controller({ path: 'api/album-category', version: '1' })
export class AlbumCategoryController
  extends BaseController
  implements AlbumCategoryControllerInterface
{
  constructor(private readonly albumCategoryService: AlbumCategoryService) {
    super(AlbumCategoryController.name);
  }

  //Get Album Category
  @Get()
  async getAlbumCategory(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('is_active') is_active?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);

      let isActive = null;

      if (is_active) {
        isActive = this.validationBooleanParams(is_active);
      }

      const result = await this.albumCategoryService.getAlbumCategory(
        page,
        limit,
        search,
        isActive,
      );
      return res
        .status(200)
        .send(this.responseMessage('album category', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Album Category
  @Post()
  async createAlbumCategory(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: AlbumCategoryDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.errorsValidation(AlbumCategoryDTO, dto);
      const result = await this.albumCategoryService.createAlbumCategory(dto);
      return res
        .status(201)
        .send(this.responseMessage('album category', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Album Category (General)
  @Put('/:uuid')
  async updateAlbumCategory(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: AlbumCategoryDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(AlbumCategoryDTO, dto);
      const result = await this.albumCategoryService.updateAlbumCategory(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(this.responseMessage('album category', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Album Category Status
  @Put('/status/:uuid')
  async updateAlbumCategoryStatus(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: AlbumCategoryStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(AlbumCategoryStatusDTO, dto);
      const result = await this.albumCategoryService.updateAlbumCategoryStatus(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(this.responseMessage('album category', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Album Category
  @Delete('/:uuid')
  async deleteAlbumCategory(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.albumCategoryService.deleteAlbumCategory(uuid);
      return res
        .status(200)
        .send(this.responseMessage('album category', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
