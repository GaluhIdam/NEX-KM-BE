import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { CommunityRoleService } from '../services/community-role.service';
import { CommunityRoleControllerInterface } from '../interface/community-role.controller.interface';
import { BaseController } from 'src/core/controllers/base.controller';
import { Response } from 'express';
import { CommunityRoleDTO } from '../dtos/community-role.dto';

@Controller({ path: 'api/community-role', version: '1' })
export class CommunityRoleController extends BaseController implements CommunityRoleControllerInterface {
  constructor(private readonly communityRoleService: CommunityRoleService) {
    super(CommunityRoleController.name);
  }

  //Get Community Role
  @Get()
  async getCommunityRole(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.communityRoleService.getCommunityRole(page, limit, search, sortBy);
      return res.status(200).send(
        this.responseMessage('community role', 'Get', 200, result)
      );
    } catch (error) {
      throw error;
    }
  }

  //Create Community Role
  @Post()
  async createCommunityRole(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: CommunityRoleDTO
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.errorsValidation(CommunityRoleDTO, dto);
      const result = await this.communityRoleService.createCommunityRole(dto);
      return res.status(201).send(
        this.responseMessage('community role', 'Create', 201, result)
      );
    } catch (error) {
      throw error
    }
  }

  //Update Community Roles
  @Put('/:uuid')
  async updateCommunityRole(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: CommunityRoleDTO
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(CommunityRoleDTO, dto);
      const result = await this.communityRoleService.updateCommunityRole(uuid, dto);
      return res.status(200).send(
        this.responseMessage('community role', 'Update', 200, result)
      );
    } catch (error) {
      throw error;
    }
  }

  //Delete Community Role
  @Delete('/:uuid')
  async deleteCommunityRole(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.communityRoleService.deleteCommunityRole(uuid);
      return res.status(200).send(
        this.responseMessage('community role', 'Delete', 200, result)
      );
    } catch (error) {
      throw error
    }
  }
}
