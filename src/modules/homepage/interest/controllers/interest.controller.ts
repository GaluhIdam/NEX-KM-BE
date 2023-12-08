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
  UseGuards,
} from '@nestjs/common';
import { InterestService } from '../services/interest.service';
import { BaseController } from 'src/core/controllers/base.controller';
import { InterestControllerInterface } from '../interfaces/interest.controller.interface';
import { Response } from 'express';
import { InterestDTO } from '../dtos/interest.dto';

@Controller({ version: '1', path: 'api/interest' })
export class InterestController
  extends BaseController
  implements InterestControllerInterface
{
  constructor(private readonly interestService: InterestService) {
    super(InterestController.name);
  }

  //Get Interest By Uuid
  @Get(':uuid')
  // @UseGuards(PermissionGuard)
  // @Permissions(permissionENUM.GET_INTEREST_BY_UUID)
  async getInterestByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.interestService.getInterestByUuid(uuid);
      return res
        .status(200)
        .send(this.responseMessage('interest', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Interest
  @Get()
  // @UseGuards(PermissionGuard)
  // @Permissions(permissionENUM.GET_INTEREST_LIST)
  async getInterest(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.interestService.getInterest(
        page,
        limit,
        search,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('interest', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Interest
  @Post()
  async createInterest(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: InterestDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.interestService.createInterest(dto);
      return res
        .status(201)
        .send(this.responseMessage('interest', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Interest
  @Put(':uuid')
  async updateInterest(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: InterestDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.interestService.updateInterest(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('interest', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Interest
  @Delete(':uuid')
  async deleteInterest(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.interestService.deleteInterest(uuid);
      return res
        .status(200)
        .send(this.responseMessage('interest', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
