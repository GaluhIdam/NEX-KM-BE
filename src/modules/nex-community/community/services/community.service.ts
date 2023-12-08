import { Injectable } from '@nestjs/common';
import { CommunityServiceInterface } from '../interface/community.services.interface';
import { PrismaCommunityService } from 'src/core/services/prisma-nex-community.service';
import { Communities } from '@prisma/clients/nex-community';
import {
    CommunityPublishDTO,
    FileImageDTO,
    PublishPrivateDTO,
} from '../dtos/community.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { AppError } from 'src/core/errors/app.error';
import { unlinkSync } from 'fs';
import { CommunitysearchService } from './community-search.service';
import { SortResults } from '@elastic/elasticsearch/lib/api/types';
import { CommunityFuseService } from '../../fuse/community-fuse.service';

@Injectable()
export class CommunityService
    extends AppError
    implements CommunityServiceInterface
{
    constructor(
        private readonly prisma: PrismaCommunityService,
        private readonly communitySearchService: CommunitysearchService,
        private readonly communityFuseService: CommunityFuseService,
    ) {
        super(CommunityService.name);
    }

    async getCommunity(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
        isAdmin: string,
    ): Promise<ResponseDTO<Communities[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const by_order = [];

        //By Member
        if (sortBy === 'membersASC') {
            by_order.push({
                communitiesCommunityMembers: {
                    _count: 'asc',
                },
            });
        }
        if (sortBy === 'membersDESC') {
            by_order.push({
                communitiesCommunityMembers: {
                    _count: 'desc',
                },
            });
        }

        //by Name
        if (sortBy === 'desc') {
            by_order.push({
                name: 'desc',
            });
        }
        if (sortBy === 'asc') {
            by_order.push({
                name: 'asc',
            });
        }

        //by Location
        if (sortBy === 'desc') {
            by_order.push({
                location: 'desc',
            });
        }
        if (sortBy === 'asc') {
            by_order.push({
                location: 'asc',
            });
        }

        //by About
        if (sortBy === 'desc') {
            by_order.push({
                about: 'desc',
            });
        }
        if (sortBy === 'asc') {
            by_order.push({
                about: 'asc',
            });
        }

        //by Leader
        if (sortBy === 'desc') {
            by_order.push({
                leader: 'desc',
            });
        }
        if (sortBy === 'asc') {
            by_order.push({
                leader: 'asc',
            });
        }

        //by Leader About
        if (sortBy === 'desc') {
            by_order.push({
                leaderProfile: 'desc',
            });
        }
        if (sortBy === 'asc') {
            by_order.push({
                leaderProfile: 'asc',
            });
        }

        //by Instagram
        if (sortBy === 'desc') {
            by_order.push({
                instagram: 'desc',
            });
        }
        if (sortBy === 'asc') {
            by_order.push({
                instagram: 'asc',
            });
        }

        //by Status publish
        if (sortBy === 'desc') {
            by_order.push({
                statusPublish: 'desc',
            });
        }
        if (sortBy === 'asc') {
            by_order.push({
                statusPublish: 'asc',
            });
        }

        //by Created at
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

        if (isAdmin === 'true') {
            const result = await this.prisma.communities.findMany({
                where: {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { location: { contains: search, mode: 'insensitive' } },
                        { about: { contains: search, mode: 'insensitive' } },
                        { leader: { contains: search, mode: 'insensitive' } },
                        {
                            leaderProfile: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            instagram: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            AND: [
                                {
                                    name: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    location: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    about: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    leader: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    leaderProfile: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    instagram: {
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
                    _count: {
                        select: {
                            communitiesCommunityActivities: true,
                            communitiesCommunityFollows: true,
                            communitiesCommunityMembers: true,
                        },
                    },
                },
            });
            this.handlingErrorEmptyData(result, 'Community');
            const total = await this.prisma.communities.count({
                where: {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { location: { contains: search, mode: 'insensitive' } },
                        { about: { contains: search, mode: 'insensitive' } },
                        { leader: { contains: search, mode: 'insensitive' } },
                        {
                            leaderProfile: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            instagram: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            AND: [
                                {
                                    name: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    location: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    about: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    leader: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    leaderProfile: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    instagram: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
            const data: ResponseDTO<Communities[]> = {
                result: result,
                total: total,
            };
            return data;
        } else {
            const result = await this.prisma.communities.findMany({
                where: {
                    statusPublish: true,
                    bannedStatus: false,
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { location: { contains: search, mode: 'insensitive' } },
                        { about: { contains: search, mode: 'insensitive' } },
                        { leader: { contains: search, mode: 'insensitive' } },
                        {
                            leaderProfile: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            instagram: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            AND: [
                                {
                                    name: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    location: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    about: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    leader: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    leaderProfile: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    instagram: {
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
                    _count: {
                        select: {
                            communitiesCommunityActivities: true,
                            communitiesCommunityFollows: true,
                            communitiesCommunityMembers: true,
                        },
                    },
                },
            });
            this.handlingErrorEmptyData(result, 'Community');
            const total = await this.prisma.communities.count({
                where: {
                    statusPublish: true,
                    bannedStatus: false,
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { location: { contains: search, mode: 'insensitive' } },
                        { about: { contains: search, mode: 'insensitive' } },
                        { leader: { contains: search, mode: 'insensitive' } },
                        {
                            leaderProfile: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            instagram: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            AND: [
                                {
                                    name: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    location: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    about: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    leader: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    leaderProfile: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    instagram: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
            const data: ResponseDTO<Communities[]> = {
                result: result,
                total: total,
            };
            return data;
        }
    }

    //Get By Id
    async getCommunityById(uuid: string): Promise<Communities> {
        const findData = await this.prisma.communities.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                _count: {
                    select: {
                        communitiesCommunityActivities: true,
                        communitiesCommunityFollows: true,
                        communitiesCommunityMembers: true,
                    },
                },
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Community');
        return findData;
    }

    //Create Community
    async createCommunity(
        dto: CommunityPublishDTO,
        image: FileImageDTO,
    ): Promise<Communities> {
        const result = await this.prisma.communities.create({
            data: {
                name: dto.name,
                personalNumber: dto.personalNumber,
                location: dto.location,
                about: dto.about,
                leader: dto.leader,
                leaderProfile: dto.leaderProfile,
                leaderPersonalNumber: dto.leaderPersonalNumber,
                instagram: dto.instagram,
                thumbnailPhoto: image.thumbnailPhotoFile[0].filename,
                thumbnailPhotoPath: `community/thumbnail/${image.thumbnailPhotoFile[0].filename}`,
                headlinedPhoto: image.headlinePhotoFile[0].filename,
                headlinedPhotoPath: `community/headline/${image.headlinePhotoFile[0].filename}`,
                statusPublish: false,
                bannedStatus: false,
                icon: `community/icon/${image.iconFile[0].filename}`,
                founded: dto.founded,
            },
        });
        await this.communityFuseService.createCheck(dto.name);
        const findRole = await this.prisma.communityRoles.findFirst({
            where: {
                name: 'Leader',
            },
        });
        if (!findRole) {
            const role = await this.prisma.communityRoles.create({
                data: {
                    name: 'Leader',
                },
            });
            await this.prisma.communityMembers.create({
                data: {
                    communityId: result.id,
                    communityRoleId: role.id,
                    personalName: dto.leader,
                    personalNumber: dto.leaderPersonalNumber,
                    personalUnit: dto.leaderUnit,
                    personalEmail: dto.leaderEmail,
                },
            });
        } else {
            await this.prisma.communityMembers.create({
                data: {
                    communityId: result.id,
                    communityRoleId: findRole.id,
                    personalName: dto.leader,
                    personalNumber: dto.leaderPersonalNumber,
                    personalUnit: dto.leaderUnit,
                    personalEmail: dto.leaderEmail,
                },
            });
        }

        this.communitySearchService.indexCommunity(result);
        return result;
    }

    //Update Community
    async updateCommunity(
        uuid: string,
        dto: CommunityPublishDTO,
        image: FileImageDTO,
    ): Promise<Communities> {
        const findData = await this.prisma.communities.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'Community');
        unlinkSync(`./uploads/${findData.headlinedPhotoPath}`);
        unlinkSync(`./uploads/${findData.thumbnailPhotoPath}`);
        unlinkSync(`./uploads/${findData.icon}`);
        const member = await this.prisma.communityMembers.findFirst({
            where: {
                personalNumber: findData.leaderPersonalNumber,
                communityId: findData.id,
            },
        });
        await this.prisma.communityMembers.update({
            where: {
                uuid: member.uuid,
            },
            data: {
                communityId: findData.id,
                personalName: dto.leader,
                personalNumber: dto.leaderPersonalNumber,
                personalUnit: dto.leaderUnit,
                personalEmail: dto.leaderEmail,
            },
        });
        const updated: Communities = await this.prisma.communities.update({
            where: {
                uuid: uuid,
            },
            data: {
                name: dto.name,
                personalNumber: dto.personalNumber,
                location: dto.location,
                about: dto.about,
                leader: dto.leader,
                leaderProfile: dto.leaderProfile,
                leaderPersonalNumber: dto.leaderPersonalNumber,
                instagram: dto.instagram,
                thumbnailPhoto: image.thumbnailPhotoFile[0].filename,
                thumbnailPhotoPath: `community/thumbnail/${image.thumbnailPhotoFile[0].filename}`,
                headlinedPhoto: image.headlinePhotoFile[0].filename,
                headlinedPhotoPath: `community/headline/${image.headlinePhotoFile[0].filename}`,
                icon: `community/icon/${image.iconFile[0].filename}`,
                founded: dto.founded,
            },
        });

        await this.communitySearchService.update(updated);
        return updated;
    }

    deleteCommunity(uuid: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    //Publish or Private
    async publishPrivate(
        uuid: string,
        dto: PublishPrivateDTO,
    ): Promise<Communities> {
        const findData = await this.prisma.communities.findFirst({
            where: {
                uuid: uuid,
            },
        });

        this.handlingErrorNotFound(findData, uuid, 'community');
        const community: Communities = await this.prisma.communities.update({
            where: {
                uuid: uuid,
            },
            data: {
                statusPublish: dto.status,
            },
        });

        await this.communitySearchService.update(community);
        return community;
    }

    //Ban Community
    async banCommunity(
        uuid: string,
        dto: PublishPrivateDTO,
    ): Promise<Communities> {
        const findData = await this.prisma.communities.findFirst({
            where: {
                uuid: uuid,
            },
        });

        this.handlingErrorNotFound(findData, uuid, 'community');
        const community: Communities = await this.prisma.communities.update({
            where: {
                uuid: uuid,
            },
            data: {
                bannedStatus: dto.status,
            },
        });

        await this.communitySearchService.update(community);
        return community;
    }

    async search(
        query: string,
        prevSort: SortResults,
    ): Promise<Record<string, any>> {
        return await this.communitySearchService.search(query, prevSort);
    }
}
