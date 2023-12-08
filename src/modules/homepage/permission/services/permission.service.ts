import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PermissionServiceInterface } from '../interfaces/permission.services.interface';
import { MasterPermission } from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Injectable()
export class PermissionService
  extends AppError
  implements PermissionServiceInterface
{
  constructor(private readonly prisma: PrismaHomepageService) {
    super(PermissionService.name);
  }
  // Get Permission
  async getPermission(
    page: number,
    limit: number,
    search: string,
  ): Promise<ResponseDTO<MasterPermission[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const result = await this.prisma.masterPermission.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          {
            AND: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      },
      take: take,
      skip: skip,
    });
    this.handlingErrorEmptyData(result, 'permission');
    const count = await this.prisma.masterPermission.count({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          {
            AND: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      },
    });
    const data: ResponseDTO<MasterPermission[]> = {
      result: result,
      total: count,
    };
    return data;
  }
}
