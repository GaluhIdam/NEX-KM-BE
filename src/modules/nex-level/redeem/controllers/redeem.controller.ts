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
} from '@nestjs/common';
import { Response } from 'express';
import { RedeemService } from '../services/redeem.service';
import { RedeemControllerInterface } from '../interface/redeem.controller.interface';
import { RedeedUpdateDTO, RedeemDTO } from '../dtos/redeem.dto';
import { BaseController } from 'src/core/controllers/base.controller';

@Controller({ path: 'api/redeem', version: '1' })
export class RedeemController
  extends BaseController
  implements RedeemControllerInterface
{
  constructor(private readonly redeemService: RedeemService) {
    super(RedeemController.name);
  }

  @Get('by-user')
  async getRedeemByPersonalNumber(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('personalNumber') personalNumber: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.redeemService.getRedeemByPersonalNumber(
        page,
        limit,
        search,
        sortBy,
        personalNumber,
      );
      return res
        .status(200)
        .send(this.responseMessage('redeems', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Get(':uuid')
  async getRedeemByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.redeemService.getRedeemByUuid(uuid);
      return res
        .status(200)
        .send(this.responseMessage('redeem', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getRedeem(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.redeemService.getRedeem(
        page,
        limit,
        search,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('redeems', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createRedeem(
    @Res() res: Response<any, Record<string, any>>,
    @Body() data: RedeemDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.redeemService.createRedeem(data);
      return res
        .status(201)
        .send(this.responseMessage('redeems', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  @Put('/:uuid')
  async updateRedeem(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() data: RedeedUpdateDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.redeemService.updateRedeemByUUID(uuid, data);
      return res
        .status(200)
        .send(this.responseMessage('redeems', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:uuid')
  async deleteRedeem(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.redeemService.deleteRedeemByUUID(uuid);
      return res
        .status(200)
        .send(this.responseMessage('redeems', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
