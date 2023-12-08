import { Injectable, mixin } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { RolePermissionServiceInterface } from '../interfaces/role-permission.service.interface';
import { Roles, UserRole } from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import {
  RoleCreateDTO,
  UserInRoleCreateDTO,
} from '../dtos/role-permission.dto';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Injectable()
export class RolePermissionService
  extends AppError
  implements RolePermissionServiceInterface
{
  constructor(private readonly prisma: PrismaHomepageService) {
    super(RolePermissionService.name);
  }
  // Get Permission In Role
  async getPermissionInRole(uuid: string): Promise<Roles> {
    const result = await this.prisma.roles.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        permissionRole: {
          include: {
            permissionMaster: true,
          },
        },
      },
    });
    this.handlingErrorNotFound(result, uuid, 'permissions in role');
    return result;
  }

  // Get User in Role
  async getUserInRole(
    roleId: number,
    page: number,
    limit: number,
    search: string,
  ): Promise<ResponseDTO<UserRole[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const result = await this.prisma.userRole.findMany({
      where: {
        roleId: roleId,
        roleUser: {
          OR: [
            { personalName: { contains: search, mode: 'insensitive' } },
            { personalNumber: { contains: search, mode: 'insensitive' } },
            { personalEmail: { contains: search, mode: 'insensitive' } },
            { personalUnit: { contains: search, mode: 'insensitive' } },
            {
              AND: [
                { personalName: { contains: search, mode: 'insensitive' } },
                { personalNumber: { contains: search, mode: 'insensitive' } },
                { personalEmail: { contains: search, mode: 'insensitive' } },
                { personalUnit: { contains: search, mode: 'insensitive' } },
              ],
            },
          ],
        },
      },
      take: take,
      skip: skip,
      include: {
        roleUser: true,
        listRole: true,
      },
    });
    this.handlingErrorEmptyData(result, 'user in role');
    const total = await this.prisma.userRole.count({
      where: {
        roleId: roleId,
        roleUser: {
          OR: [
            { personalName: { contains: search, mode: 'insensitive' } },
            { personalNumber: { contains: search, mode: 'insensitive' } },
            { personalEmail: { contains: search, mode: 'insensitive' } },
            { personalUnit: { contains: search, mode: 'insensitive' } },
            {
              AND: [
                { personalName: { contains: search, mode: 'insensitive' } },
                { personalNumber: { contains: search, mode: 'insensitive' } },
                { personalEmail: { contains: search, mode: 'insensitive' } },
                { personalUnit: { contains: search, mode: 'insensitive' } },
              ],
            },
          ],
        },
      },
    });

    const data: ResponseDTO<UserRole[]> = {
      result: result,
      total: total,
    };
    return data;
  }

  // Create User Role
  async createUserInRole(dto: UserInRoleCreateDTO): Promise<UserRole> {
    const checkUser = await this.prisma.userList.findFirst({
      where: {
        id: dto.userId,
      },
    });
    this.handlingErrorNotFound(checkUser, dto.userId, 'user');
    const checkRole = await this.prisma.roles.findFirst({
      where: {
        id: dto.roleId,
      },
    });
    this.handlingErrorNotFound(checkRole, dto.userId, 'role');
    return await this.prisma.userRole.create({
      data: {
        roleId: dto.roleId,
        userId: dto.userId,
      },
    });
  }

  // Delete User In Role
  async deleteUserInRole(uuid: string): Promise<UserRole> {
    const findData = await this.prisma.userRole.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'user in role');
    return await this.prisma.userRole.delete({
      where: {
        uuid: uuid,
      },
    });
  }

  // Get Role Permission
  async getRolePermission(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Roles[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const by_order = [];

    if (sortBy === 'desc') {
      by_order.push({
        createdAt: 'desc',
      });
    }
    if (sortBy === 'asc') {
      by_order.push({
        createdAt: 'asc',
      });
    }

    const result = await this.prisma.roles.findMany({
      where: {
        OR: [
          {
            name: { contains: search, mode: 'insensitive' },
          },
          {
            description: { contains: search, mode: 'insensitive' },
          },
          {
            AND: [
              {
                name: { contains: search, mode: 'insensitive' },
              },
              {
                description: { contains: search, mode: 'insensitive' },
              },
            ],
          },
        ],
      },
      take: take,
      skip: skip,
      orderBy: by_order,
      include: {
        _count: {
          select: {
            permissionRole: true,
          },
        },
        permissionRole: {
          include: {
            permissionMaster: true,
          },
        },
      },
    });

    const total = await this.prisma.roles.count({
      where: {
        OR: [
          {
            name: { contains: search, mode: 'insensitive' },
          },
          {
            description: { contains: search, mode: 'insensitive' },
          },
          {
            AND: [
              {
                name: { contains: search, mode: 'insensitive' },
              },
              {
                description: { contains: search, mode: 'insensitive' },
              },
            ],
          },
        ],
      },
    });

    const data: ResponseDTO<Roles[]> = {
      result: result,
      total: total,
    };
    return data;
  }

  // Create Role Permission
  async createRolePermission(dto: RoleCreateDTO): Promise<Roles> {
    const result = await this.prisma.roles.create({
      data: {
        name: dto.name,
        description: dto.description,
        page: dto.page,
      },
    });
    if (dto.permission) {
      const perm = dto.permission.map((data) => ({
        roleId: result.id,
        masterPermissionId: data.masterPermissionId,
      }));
      await this.prisma.rolePermission.createMany({
        data: perm,
      });
    }
    return result;
  }

  // Update Role Permission
  async updateRolePermission(uuid: string, dto: RoleCreateDTO): Promise<Roles> {
    const findData = await this.prisma.roles.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        permissionRole: {
          include: {
            permissionMaster: true,
          },
        },
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'role');
    const result = await this.prisma.roles.update({
      where: {
        uuid: uuid,
      },
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
    if (dto.permission) {
      findData.permissionRole.map(async (data) => {
        await this.prisma.rolePermission.delete({
          where: {
            uuid: data.uuid,
          },
        });
      });
      const perm = dto.permission.map((data) => ({
        roleId: result.id,
        masterPermissionId: data.masterPermissionId,
      }));
      await this.prisma.rolePermission.createMany({
        data: perm,
      });
    }
    return result;
  }

  // Delete Role Permission
  async deleteRolePermission(uuid: string): Promise<Roles> {
    const findData = await this.prisma.roles.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'role');
    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId: findData.id,
      },
    });
    return await this.prisma.roles.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
