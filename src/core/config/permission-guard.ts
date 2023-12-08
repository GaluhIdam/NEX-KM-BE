import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaHomepageService } from '../services/prisma-homepage.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaHomepageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions || permissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    if (!token) {
      return false;
    }
    const userData = await this.prisma.userList.findFirst({
      where: {
        token: token,
      },
      include: {
        roleUser: {
          select: {
            listRole: {
              include: {
                permissionRole: {
                  include: {
                    permissionMaster: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (userData) {
      for (const data of userData.roleUser) {
        for (const subData of data.listRole.permissionRole) {
          for (const roledata of permissions) {
            if (subData.permissionMaster.name === roledata) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }
}
