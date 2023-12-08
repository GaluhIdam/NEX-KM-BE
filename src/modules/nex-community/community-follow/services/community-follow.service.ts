import { Injectable } from '@nestjs/common';
import { CommunityFollowServiceInterface } from '../interface/community-follow.services.interface';
import { CommunityFollowDTO } from '../dtos/community-follow.dto';
import {
    CommunityFollows,
    CommunityMembers,
} from '@prisma/clients/nex-community';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { AppError } from 'src/core/errors/app.error';

@Injectable()
export class CommunityFollowService
    extends AppError
    implements CommunityFollowServiceInterface
{
    constructor(private readonly prisma: PrismaCommunityService) {
        super(CommunityFollowService.name);
    }

    async getCommunityUser(
        personalNumber: string,
    ): Promise<CommunityMembers[]> {
        const result = await this.prisma.communityMembers.findMany({
            where: {
                personalNumber: personalNumber,
            },
            include: {
                communityMembersCommunities: true,
            },
        });
        this.handlingErrorEmptyData(result, 'community');
        return result;
    }

    async getCommunityFollowByPersonalNumber(
        personalNumber: string,
        communityId: number,
    ): Promise<CommunityFollows> {
        const findData = await this.prisma.communityFollows.findFirst({
            where: {
                personalNumber: personalNumber,
                communityId: communityId,
            },
        });
        this.handlingErrorNotFound(
            findData,
            personalNumber,
            'community follow',
        );
        return findData;
    }

    async getCommunityFollow(
        page: number,
        limit: number,
        communityId: number,
    ): Promise<CommunityFollows[]> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        return this.prisma.communityFollows.findMany({
            where: {
                communityId: communityId,
            },
            take: take,
            skip: skip,
        });
    }

    async createCommunityFollow(
        dto: CommunityFollowDTO,
    ): Promise<CommunityFollowDTO> {
        return await this.prisma.communityFollows.create({
            data: {
                personalNumber: dto.personalNumber,
                communityId: dto.communityId,
            },
        });
    }

    async deleteCommunityFollow(uuid: string): Promise<CommunityFollows> {
        return await this.prisma.communityFollows.delete({
            where: {
                uuid: uuid,
            },
        });
    }
}
