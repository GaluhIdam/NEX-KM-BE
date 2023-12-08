import { Controller, Get, Query, Res } from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { PermissionControllerInterface } from '../interfaces/permission.controller.interface';
import { Response } from 'express';
import { PermissionService } from '../services/permission.service';

@Controller({ path: 'api/permission', version: '1' })
export class PermissionController
  extends BaseController
  implements PermissionControllerInterface
{
  constructor(private readonly permissionService: PermissionService) {
    super(PermissionController.name);
  }

  // Get Permission
  @Get()
  async getPermission(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.permissionService.getPermission(
        page,
        limit,
        search,
      );
      return res
        .status(200)
        .send(this.responseMessage('permission', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
