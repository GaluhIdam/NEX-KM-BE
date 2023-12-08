import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { v4 as uuidv4 } from 'uuid';
import { CommunityRoleServiceInterface } from '../interface/community-role.services.interface';
import { CommunityRoles } from '@prisma/clients/nex-community';
import { CommunityRoleDTO } from '../dtos/community-role.dto';
import { AppError } from 'src/core/errors/app.error';
import { ResponseDTO } from 'src/core/dtos/response.dto';

@Injectable()
export class CommunityRoleService extends AppError implements CommunityRoleServiceInterface {
  constructor(private readonly prisma: PrismaCommunityService) {
    super(CommunityRoleService.name)
  }

  //Get Community Role
  async getCommunityRole(page: number, limit: number, search: string, sortBy: string): Promise<ResponseDTO<CommunityRoles[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const by_order = [];
    if (sortBy === 'desc') {
      by_order.push({
        updatedAt: 'desc',
      });
    }
    if (sortBy === 'asc') {
      by_order.push({
        updatedAt: 'asc',
      });
    }

    if (page && limit) {
      const result = await this.prisma.communityRoles.findMany({
        where: {
          name: { contains: search, mode: 'insensitive' }
        },
        take: take,
        skip: skip,
        orderBy: by_order,
      });
      this.handlingErrorEmptyData(result, 'Community Role');
      const total = await this.prisma.communityRoles.count({
        where: {
          name: { contains: search, mode: 'insensitive' }
        },
      });
      const data: ResponseDTO<CommunityRoles[]> = {
        result: result,
        total: total
      }
      return data;
    } else {
      const result = await this.prisma.communityRoles.findMany({
        where: {
          name: { contains: search, mode: 'insensitive' }
        },
        orderBy: by_order,
      });
      this.handlingErrorEmptyData(result, 'Community Role');
      const total = await this.prisma.communityRoles.count({
        where: {
          name: { contains: search, mode: 'insensitive' }
        },
      });
      const data: ResponseDTO<CommunityRoles[]> = {
        result: result,
        total: total
      }
      return data;
    }
  }

  //Create Community
  async createCommunityRole(dto: CommunityRoleDTO): Promise<CommunityRoles> {
    return await this.prisma.communityRoles.create({
      data: {
        name: dto.name
      }
    });
  }

  //Update Community Role
  async updateCommunityRole(uuid: string, dto: CommunityRoleDTO): Promise<CommunityRoles> {
    const findData = await this.prisma.communityRoles.findFirst({
      where: {
        uuid: uuid
      }
    });
    this.handlingErrorNotFound(findData, uuid, 'Community Role');
    return await this.prisma.communityRoles.update({
      where: {
        uuid: uuid
      },
      data: {
        name: dto.name
      }
    });
  }

  //Delete Community Role
  async deleteCommunityRole(uuid: string): Promise<CommunityRoles> {
    const findData = await this.prisma.communityRoles.findFirst({
      where: {
        uuid: uuid
      }
    });
    this.handlingErrorNotFound(findData, uuid, 'Community Role');
    return await this.prisma.communityRoles.delete({
      where: {
        uuid: uuid
      }
    });
  }
}
