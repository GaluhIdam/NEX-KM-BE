import { Injectable } from '@nestjs/common';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { CommunityActivities } from '@prisma/clients/nex-community';
import { CommunityActivityDTO } from '../dtos/community-activity.dto';
import { CommunityActivityServiceInterface } from '../interface/community-activity.services.interface';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { AppError } from 'src/core/errors/app.error';
import { unlinkSync } from 'fs';
import { CommunityActivitysearchService } from './community-activity-search.service';
import { CommunityFuseService } from '../../fuse/community-fuse.service';
import { ForYourPageService } from 'src/modules/homepage/for-your-page/services/for-your-page.service';
import { ForYourPageDTO } from 'src/modules/homepage/for-your-page/dto/for-your-page.dto';

@Injectable()
export class CommunityActivityService
    extends AppError
    implements CommunityActivityServiceInterface
{
    constructor(
        private readonly prisma: PrismaCommunityService,
        private readonly communityActivitySearch: CommunityActivitysearchService,
        private readonly communityFuseService: CommunityFuseService,
        private readonly fypService: ForYourPageService,
    ) {
        super(CommunityActivityService.name);
    }

    async getActivityByUserMember(
        personalNumber: string,
        page: number,
        limit: number,
    ): Promise<ResponseDTO<CommunityActivities[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const result = await this.prisma.communityActivities.findMany({
            where: {
                communityActivitiesCommunities: {
                    communitiesCommunityMembers: {
                        some: {
                            personalNumber: personalNumber,
                        },
                    },
                },
            },
            skip: skip,
            take: take,
            include: {
                communityActivitiesCommunities: true,
            },
        });
        const total = await this.prisma.communityActivities.count({
            where: {
                communityActivitiesCommunities: {
                    communitiesCommunityMembers: {
                        some: {
                            personalNumber: personalNumber,
                        },
                    },
                },
            },
        });
        const data: ResponseDTO<CommunityActivities[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    async search(query: string): Promise<Record<string, any>> {
        return this.communityActivitySearch.search(query);
    }

    //Get Community
    async getCommunityActivityByCommunity(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
        communityId: number,
    ): Promise<ResponseDTO<CommunityActivities[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const by_order = [];

        if (sortBy == 'createdAtDESC') {
            by_order.push({
                createdAt: 'desc',
            });
        }
        if (sortBy == 'createdAtASC') {
            by_order.push({
                createdAt: 'asc',
            });
        }

        if (sortBy == 'titleDESC') {
            by_order.push({
                title: 'desc',
            });
        }
        if (sortBy == 'titleASC') {
            by_order.push({
                title: 'asc',
            });
        }
        const result = await this.prisma.communityActivities.findMany({
            where: {
                communityId: Number(communityId),
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
            take: take,
            skip: skip,
            orderBy: by_order,
        });
        this.handlingErrorEmptyData(result, 'Community Activity');
        const total = await this.prisma.communityActivities.count({
            where: {
                communityId: Number(communityId),
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
        });
        const data: ResponseDTO<CommunityActivities[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Get By uuId
    async geeActivityById(uuid: string): Promise<CommunityActivities> {
        return await this.prisma.communityActivities.findFirst({
            where: {
                uuid: uuid,
            },
        });
    }

    //Get Community Activity
    async getCommunityActivity(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
    ): Promise<ResponseDTO<CommunityActivities[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const by_order = [];

        if (sortBy == 'createdAtDESC') {
            by_order.push({
                createdAt: 'desc',
            });
        }
        if (sortBy == 'createdAtASC') {
            by_order.push({
                createdAt: 'asc',
            });
        }

        if (sortBy == 'titleDESC') {
            by_order.push({
                title: 'desc',
            });
        }
        if (sortBy == 'titleASC') {
            by_order.push({
                title: 'asc',
            });
        }
        const result = await this.prisma.communityActivities.findMany({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
            take: take,
            skip: skip,
            orderBy: by_order,
            include: {
                communityActivitiesCommunities: {
                    include: {
                        communitiesCommunityMembers: true,
                    },
                },
            },
        });
        this.handlingErrorEmptyData(result, 'Community Activity');
        const total = await this.prisma.communityActivities.count({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
        });
        const data: ResponseDTO<CommunityActivities[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Create Activity
    async createCommunityActivity(
        dto: CommunityActivityDTO,
    ): Promise<CommunityActivities> {
        const data: CommunityActivities =
            await this.prisma.communityActivities.create({
                data: {
                    communityId: Number(dto.communityId),
                    title: dto.title,
                    description: dto.description,
                    photo: dto.photo,
                    path: dto.path,
                    personalNumber: dto.personalNumber,
                    personalName: dto.personalName,
                },
            });
        await this.communityFuseService.createCheck(dto.title);
        const fyp: ForYourPageDTO = {
            uuid: data.uuid,
            title: data.title,
            description: data.description,
            personalNumber: data.personalNumber,
            personalName: data.personalName,
            path: data.path,
            link: '/user/nex-community/activity-detail/' + data.uuid + '/',
            category: 'community',
            idContent: data.id,
            cover: null,
        };
        await this.fypService.createForYourPage(fyp);
        this.communityActivitySearch.indexCommunityActivity(data);
        return data;
    }

    //Update Activity
    async updateCommunityActivity(
        uuid: string,
        dto: CommunityActivityDTO,
    ): Promise<CommunityActivityDTO> {
        const findData = await this.prisma.communityActivities.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Community Activity');
        unlinkSync(`./uploads/${findData.path}`);
        const data: CommunityActivities =
            await this.prisma.communityActivities.update({
                where: {
                    uuid: uuid,
                },
                data: {
                    title: dto.title,
                    description: dto.description,
                    photo: dto.photo,
                    path: dto.path,
                },
            });
        await this.fypService.deleteForYourPage(findData.uuid);
        const fyp: ForYourPageDTO = {
            uuid: data.uuid,
            title: data.title,
            description: data.description,
            personalNumber: data.personalNumber,
            personalName: data.personalName,
            path: data.path,
            link: '/user/nex-community/activity-detail/' + data.uuid + '/',
            category: 'community',
            idContent: data.id,
            cover: null,
        };
        await this.fypService.createForYourPage(fyp);
        await this.communityActivitySearch.update(data);
        return data;
    }

    //Delete Community
    async deleteCommunityActivity(uuid: string): Promise<CommunityActivities> {
        const findData = await this.prisma.communityActivities.findFirst({
            where: {
                uuid: uuid,
            },
        });

        this.handlingErrorNotFound(findData, uuid, 'Community Activity');
        unlinkSync(`./uploads/${findData.path}`);
        const deleted: CommunityActivities =
            await this.prisma.communityActivities.delete({
                where: {
                    uuid: uuid,
                },
            });

        await this.communityActivitySearch.remove(uuid);
        return deleted;
    }
}
