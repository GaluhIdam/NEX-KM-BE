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
import { SharingExpService } from '../services/sharing-exp.service';
import { SharingExpControllerInterface } from '../interfaces/sharing-exp.controller.intreface';
import { Response } from 'express';
import { BaseController } from 'src/core/controllers/base.controller';
import { SharingExpDTO, SharingExpStatusDTO } from '../dtos/sharing-exp.dto';

@Controller({ path: 'api/sharing-exp', version: '1' })
export class SharingExpController
  extends BaseController
  implements SharingExpControllerInterface
{
  constructor(private readonly sharingExpService: SharingExpService) {
    super(SharingExpController.name);
  }

  //Get Sharing Exp By Uuid
  @Get(':uuid')
  async getSharingExpByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.sharingExpService.getSharingExpByUuid(uuid);
      return res
        .status(200)
        .send(this.responseMessage('sharing experience', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Sharing Exp
  @Get()
  async getSharingExp(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('isAdmin') isAdmin: boolean,
    @Query('personalNumber') personalNumber?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.sharingExpService.getSharingExp(
        page,
        limit,
        search,
        sortBy,
        isAdmin,
        personalNumber,
      );
      return res
        .status(200)
        .send(this.responseMessage('sharing experience', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Sharing Exp
  @Post()
  async createSharingExp(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: SharingExpDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.errorsValidation(SharingExpDTO, dto);
      const result = await this.sharingExpService.createSharingExp(dto);
      return res
        .status(201)
        .send(this.responseMessage('sharing experience', 'Get', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Sharing Exp
  @Put(':uuid')
  async updateSharingExp(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: SharingExpDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(SharingExpDTO, dto);
      const result = await this.sharingExpService.updateSharingExp(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('sharing experience', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Sharing Exp
  @Delete(':uuid')
  async deleteSharingExp(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.sharingExpService.deleteSharingExp(uuid);
      return res
        .status(200)
        .send(
          this.responseMessage('sharing experience', 'Delete', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }

  //Approve or Reject Sharing Exp
  @Put('approve-reject/:uuid')
  async approveReject(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: SharingExpStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.sharingExpService.appproveReject(uuid, dto);
      return res
        .status(200)
        .send(
          this.responseMessage('sharing experience', 'update', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }
}
