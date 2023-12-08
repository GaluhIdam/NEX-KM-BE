import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { EbookCollectionReadControllerInterface } from '../interfaces/ebook-collection-read.controller.interface';
import { Response } from 'express';
import { EbookCollectionReadDTO } from '../dtos/ebook-collection-read.dto';
import { EbookCollectionReadService } from '../services/ebook-collection-read.service';

@Controller({ path: 'api/ebook-collection-read', version: '1' })
export class EbookCollectionReadController
  extends BaseController
  implements EbookCollectionReadControllerInterface
{
  constructor(
    private readonly ebookcollectionReadService: EbookCollectionReadService,
  ) {
    super(EbookCollectionReadController.name);
  }

  //Get Ebook Collection
  @Get('/collection')
  async getEbookCollection(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('personalNumber') personalNumber?: string,
    @Query('search') search?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.ebookcollectionReadService.getEbookCollection(
        page,
        limit,
        personalNumber,
        search,
      );
      return res
        .status(200)
        .send(this.responseMessage('ebook collection', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Ebook Collevtion
  @Post('/collection')
  async createEbookCollection(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: EbookCollectionReadDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.errorsValidation(EbookCollectionReadDTO, dto);
      const result =
        await this.ebookcollectionReadService.createEbookCollection(dto);
      return res
        .status(201)
        .send(this.responseMessage('ebook collection', 'create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  @Post('/collection/check')
  async checkEbookCollectionExist(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: EbookCollectionReadDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.errorsValidation(EbookCollectionReadDTO, dto);
      const result =
        await this.ebookcollectionReadService.checkEbookCollectionExist(dto);
      return res
        .status(201)
        .send(this.responseMessage('ebook collection', 'check', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Ebook Collection
  @Delete('/collection/:uuid')
  async deleteEbookCollection(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result =
        await this.ebookcollectionReadService.deleteEbookCollection(uuid);
      return res
        .status(200)
        .send(this.responseMessage('ebook collection', 'delete', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Ebook Read
  @Get('/read')
  async getEbookRead(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('personalNumber') personalNumber?: string,
    @Query('search') search?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.ebookcollectionReadService.getEbookRead(
        page,
        limit,
        personalNumber,
        search,
      );
      return res
        .status(200)
        .send(this.responseMessage('ebook read', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Ebook Read
  @Post('/read')
  async createEbookRead(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: EbookCollectionReadDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.errorsValidation(EbookCollectionReadDTO, dto);
      const result = await this.ebookcollectionReadService.createEbookRead(dto);
      return res
        .status(201)
        .send(this.responseMessage('ebook read', 'create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Ebook Read
  @Delete('/read/:uuid')
  async deleteEbookRead(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.ebookcollectionReadService.deleteEbookRead(
        uuid,
      );
      return res
        .status(200)
        .send(this.responseMessage('ebook read', 'delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
