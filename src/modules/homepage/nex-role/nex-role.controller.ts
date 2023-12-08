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
import { NexRoleControllerInterface } from './interfaces/nex-role.controller.interface';
import { Response } from 'express';
import { NexRoleService } from './services/nex-role.service';
import { BaseController } from 'src/core/controllers/base.controller';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { NexRoleDTO } from './dtos/nex-role.dto';
@Controller({ path: 'api/nex-role', version: '1' })
export class NexRoleController extends BaseController implements NexRoleControllerInterface {
  constructor(private readonly nexRoleService: NexRoleService) {
    super(NexRoleController.name)
  }

  //Get 
  @Get()
  async showAllDataSldiers(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.nexRoleService.findFirstHundredNexRolesData(
        page,
        limit,
      );

      return res.status(200).send(result);
    } catch (error) {
      throw new HttpException('Oops! Data is empty.', HttpStatus.NOT_FOUND);
    }
  }

  //Create Nex Role
  @Post()
  async createNexRole(
    @Res() res: Response<any, Record<string, any>>,
    @Body() data: any,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const errors = await validate(plainToClass(NexRoleDTO, data));
      if (errors.length > 0) {
        return res.status(400).send(this.customMessageErrors(errors));
      }
      const result = await this.nexRoleService.createNexRoleData(data);
      return res.status(200).send(result);
    } catch (error) {
      throw new HttpException(
        'Oops! Create data failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('/:uuid')
  async deleteNexRoleByUUID(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.nexRoleService.deleteNexRoleData(uuid);
      return res.status(200).send(result);
    } catch (error) {
      throw new HttpException('Oops! UUID not found.', HttpStatus.NOT_FOUND);
    }
  }

  @Put('/:uuid')
  async updateNexRoleByUUID(
    @Res() res: Response<any, Record<string, any>>,
    @Body() data: any,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const errors = await validate(plainToClass(NexRoleDTO, data));
      if (errors.length > 0) {
        return res.status(400).send(this.customMessageErrors(errors));
      }
      const result = await this.nexRoleService.updateNexRoleData(data, uuid);
      return res.status(200).send(result);
    } catch (error) {
      throw new HttpException('Oops! UUID not found.', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:uuid')
  async detailNexRoleUsingUUID(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.nexRoleService.findNexRoleByUUID(uuid);

      return res.status(200).send(result);
    } catch (error) {
      throw new HttpException('Oops! UUID not found.', HttpStatus.NOT_FOUND);
    }
  }
}
