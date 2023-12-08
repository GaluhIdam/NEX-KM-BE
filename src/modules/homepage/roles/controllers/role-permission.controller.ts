import {
  BadRequestException,
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
import { BaseController } from 'src/core/controllers/base.controller';
import { RolePermissionControllerInterface } from '../interfaces/role-permission.controller.interface';
import { Response } from 'express';
import {
  RoleCreateDTO,
  UserInRoleCreateDTO,
} from '../dtos/role-permission.dto';
import { RolePermissionService } from '../services/role-permission.service';

@Controller({ path: 'api/role-permission', version: '1' })
export class RolePermissionController
  extends BaseController
  implements RolePermissionControllerInterface
{
  constructor(private readonly rolepermissionService: RolePermissionService) {
    super(RolePermissionController.name);
  }

  // Get User in Roles
  @Get('user-role')
  async getUserInRole(
    @Res() res: Response<any, Record<string, any>>,
    @Query('roleId') roleId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      if (!roleId) {
        throw new BadRequestException('roleId is required!');
      }
      this.validatePageLimit(page, limit);
      const result = await this.rolepermissionService.getUserInRole(
        roleId,
        page,
        limit,
        search,
      );
      return res
        .status(200)
        .send(this.responseMessage('user in roles', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  // Create User In Role
  @Post('user-role')
  async createUserInRole(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: UserInRoleCreateDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.rolepermissionService.createUserInRole(dto);
      return res
        .status(201)
        .send(this.responseMessage('user in roles', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  // Delete User in Role
  @Delete('user-role/:uuid')
  async deleteUserInRole(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.rolepermissionService.deleteUserInRole(uuid);
      return res
        .status(200)
        .send(this.responseMessage('user in roles', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }

  // Get Role Permission Data
  @Get()
  async getRolePermission(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.rolepermissionService.getRolePermission(
        page,
        limit,
        search,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('role permission', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

    // Get Permission In Roles
  @Get(':uuid')
  async getPermissionInRole(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.rolepermissionService.getPermissionInRole(uuid);
      return res
        .status(200)
        .send(this.responseMessage('permission in roles', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  // Create Role Permission Data
  @Post()
  async createRolePermission(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: RoleCreateDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.rolepermissionService.createRolePermission(dto);
      return res
        .status(201)
        .send(this.responseMessage('role permission', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  // Update Role Permission
  @Put(':uuid')
  async updateRolePermission(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: RoleCreateDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.rolepermissionService.updateRolePermission(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(this.responseMessage('role permission', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  // Delete Role Permission
  @Delete(':uuid')
  async deleteRolePermission(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.rolepermissionService.deleteRolePermission(
        uuid,
      );
      return res
        .status(200)
        .send(this.responseMessage('role permission', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
