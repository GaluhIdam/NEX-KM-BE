import { BadRequestException, Injectable } from '@nestjs/common';
import { CommunityMemberServiceInterface } from '../interface/community-member.services.interface';
import { CommunityMemberDTO } from '../dtos/community-member.dto';
import { CommunityMembers } from '@prisma/clients/nex-community';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from 'src/core/errors/app.error';
import { ResponseDTO } from 'src/core/dtos/response.dto';

@Injectable()
export class CommunityMemberService
  extends AppError
  implements CommunityMemberServiceInterface
{
  constructor(private readonly prisma: PrismaCommunityService) {
    super(CommunityMemberService.name);
  }

  //Get Community Member
  async getCommunityMember(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    communityId: number,
  ): Promise<ResponseDTO<CommunityMembers[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const by_order = [];

    //by Name
    if (sortBy === 'personalNameDESC') {
      by_order.push({
        personalName: 'desc',
      });
    }
    if (sortBy === 'personalNameASC') {
      by_order.push({
        personalName: 'asc',
      });
    }
    //by Unit
    if (sortBy === 'personalUnitDESC') {
      by_order.push({
        personalUnit: 'desc',
      });
    }
    if (sortBy === 'personalUnitASC') {
      by_order.push({
        personalUnit: 'asc',
      });
    }

    //by Email
    if (sortBy === 'personalEmailDESC') {
      by_order.push({
        personalEmail: 'desc',
      });
    }
    if (sortBy === 'personalEmailASC') {
      by_order.push({
        personalEmail: 'asc',
      });
    }

    //by Date
    if (sortBy === 'createdAtDESC') {
      by_order.push({
        createdAt: 'desc',
      });
    }
    if (sortBy === 'createdAtASC') {
      by_order.push({
        createdAt: 'asc',
      });
    }

    const result = await this.prisma.communityMembers.findMany({
      where: {
        AND: [
          {
            communityId: Number(communityId),
          },
          {
            OR: [
              { personalName: { contains: search, mode: 'insensitive' } },
              { personalNumber: { contains: search, mode: 'insensitive' } },
              { personalUnit: { contains: search, mode: 'insensitive' } },
              { personalEmail: { contains: search, mode: 'insensitive' } },
              {
                AND: [
                  { personalName: { contains: search, mode: 'insensitive' } },
                  { personalNumber: { contains: search, mode: 'insensitive' } },
                  { personalUnit: { contains: search, mode: 'insensitive' } },
                  { personalEmail: { contains: search, mode: 'insensitive' } },
                ],
              },
            ],
          },
        ],
      },
      take: take,
      skip: skip,
      orderBy: by_order,
      include: {
        communityMembersCommunityRoles: true,
      },
    });
    this.handlingErrorEmptyData(result, 'Community Member');

    const total = await this.prisma.communityMembers.count({
      where: {
        AND: [
          {
            communityId: Number(communityId),
          },
          {
            OR: [
              { personalName: { contains: search, mode: 'insensitive' } },
              { personalNumber: { contains: search, mode: 'insensitive' } },
              { personalUnit: { contains: search, mode: 'insensitive' } },
              { personalEmail: { contains: search, mode: 'insensitive' } },
              {
                AND: [
                  { personalName: { contains: search, mode: 'insensitive' } },
                  { personalNumber: { contains: search, mode: 'insensitive' } },
                  { personalUnit: { contains: search, mode: 'insensitive' } },
                  { personalEmail: { contains: search, mode: 'insensitive' } },
                ],
              },
            ],
          },
        ],
      },
    });
    const data: ResponseDTO<CommunityMembers[]> = {
      result: result,
      total: total,
    };
    return data;
  }

  //Create Community Member
  async createCommunityMember(
    dto: CommunityMemberDTO,
  ): Promise<CommunityMembers> {
    return await this.prisma.communityMembers.create({
      data: {
        communityId: dto.communityId,
        communityRoleId: dto.communityRoleId,
        personalName: dto.personalName,
        personalNumber: dto.personalNumber,
        personalUnit: dto.personalUnit,
        personalEmail: dto.personalEmail,
      },
    });
  }

  //Update Community Member
  async updateCommunityMember(
    uuid: string,
    dto: CommunityMemberDTO,
  ): Promise<CommunityMembers> {
    const findData = await this.prisma.communityMembers.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Community Member');
    return await this.prisma.communityMembers.update({
      where: {
        uuid: uuid,
      },
      data: {
        communityId: dto.communityId,
        communityRoleId: dto.communityRoleId,
        personalName: dto.personalName,
        personalNumber: dto.personalNumber,
        personalUnit: dto.personalUnit,
        personalEmail: dto.personalEmail,
      },
    });
  }

  //Delete Community Member
  async deleteCommunityMember(uuid: string): Promise<CommunityMembers> {
    const findData = await this.prisma.communityMembers.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Community Member');
    return await this.prisma.communityMembers.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
