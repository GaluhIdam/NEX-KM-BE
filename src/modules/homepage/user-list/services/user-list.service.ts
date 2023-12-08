import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { UserListServiceInterface } from '../interfaces/user-list.service.interface';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import {
    FollowingFollower,
    UserInterest,
    UserList,
    UserSkill,
} from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import {
    UserFollowerDTO,
    UserInfoDTO,
    UserInterestDTO,
    UserListDTO,
    UserSkillDTO,
    signAsDTO,
} from '../dtos/user-list.dto';
import { unlinkSync } from 'fs';
import { PointService } from 'src/modules/nex-level/point/services/point.service';

@Injectable()
export class UserListService
    extends AppError
    implements UserListServiceInterface
{
    constructor(
        private readonly prisma: PrismaHomepageService,
        private readonly pointService: PointService,
    ) {
        super(UserListService.name);
    }

    //Checker
    async checkFollower(follower: string, following: string): Promise<boolean> {
        const check = await this.prisma.followingFollower.findFirst({
            where: {
                personalNumberFollower: follower,
                personalNumberFollowing: following,
            },
        });
        if (check) {
            return true;
        } else {
            return false;
        }
    }

    //Getting Follower
    async getFollower(
        page: number,
        limit: number,
        personalNumber: string,
    ): Promise<ResponseDTO<FollowingFollower[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const result = await this.prisma.followingFollower.findMany({
            where: {
                personalNumberFollowing: personalNumber,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: take,
            skip: skip,
        });
        const count = await this.prisma.followingFollower.count({
            where: {
                personalNumberFollowing: personalNumber,
            },
        });
        const data: ResponseDTO<FollowingFollower[]> = {
            result: result,
            total: count,
        };
        return data;
    }

    //Getting Following
    async getFollowing(
        page: number,
        limit: number,
        personalNumber: string,
    ): Promise<ResponseDTO<FollowingFollower[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const result = await this.prisma.followingFollower.findMany({
            where: {
                personalNumberFollower: personalNumber,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: take,
            skip: skip,
        });
        const count = await this.prisma.followingFollower.count({
            where: {
                personalNumberFollower: personalNumber,
            },
        });
        const data: ResponseDTO<FollowingFollower[]> = {
            result: result,
            total: count,
        };
        return data;
    }

    //Create Follower
    async createFollowingFollower(
        dto: UserFollowerDTO,
    ): Promise<FollowingFollower> {
        const findData = await this.prisma.userList.findFirst({
            where: {
                personalNumber: dto.personalNumberFollower,
            },
        });
        this.handlingErrorNotFound(
            findData,
            dto.personalNumberFollower,
            'follower',
        );
        const check = await this.prisma.followingFollower.findFirst({
            where: {
                personalNumberFollowing: dto.personalNumberFollowing,
                personalNumberFollower: dto.personalNumberFollower,
            },
        });
        if (!check) {
            const userFollower = await this.prisma.userList.findFirst({
                where: {
                    personalNumber: dto.personalNumberFollower,
                },
            });
            const userFollowing = await this.prisma.userList.findFirst({
                where: {
                    personalNumber: dto.personalNumberFollowing,
                },
            });
            return await this.prisma.followingFollower.create({
                data: {
                    personalNumberFollowing: dto.personalNumberFollowing,
                    personalNumberFollower: dto.personalNumberFollower,
                    personalNameFollower: userFollower.personalName,
                    personalNameFollowing: userFollowing.personalName,
                },
            });
        } else {
            this.deleteFollowingFollower(check.uuid);
        }
    }

    //Delete Follower
    async deleteFollowingFollower(uuid: string): Promise<FollowingFollower> {
        const findData = await this.prisma.followingFollower.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'follower');
        return await this.prisma.followingFollower.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    async getUserListByPersonalNumber(
        personalNumber: string,
    ): Promise<UserList> {
        const findUser = await this.prisma.userList.findFirst({
            where: {
                personalNumber: personalNumber,
            },
            include: {
                interestUser: {
                    include: {
                        interestList: true,
                    },
                },
                skillUser: {
                    include: {
                        skillList: true,
                    },
                },
                roleUser: {
                    select: {
                        listRole: true,
                    },
                },
            },
        });
        this.handlingErrorNotFound(findUser, personalNumber, 'user list');
        if (findUser) {
            await this.pointService.resetPointOfYears(personalNumber);
        }
        return findUser;
    }

    //Get User lsit
    async getUserList(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
    ): Promise<ResponseDTO<UserList[]>> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const by_order = [];
        if (sortBy === 'desc') {
            by_order.push({
                personalName: 'desc',
            });
        }
        if (sortBy === 'asc') {
            by_order.push({
                personalName: 'asc',
            });
        }

        const result = await this.prisma.userList.findMany({
            where: {
                OR: [
                    {
                        personalNumber: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    { personalName: { contains: search, mode: 'insensitive' } },
                    {
                        personalEmail: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    { personalUnit: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                personalNumber: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalName: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalEmail: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalUnit: {
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
                interestUser: {
                    include: {
                        interestList: true,
                    },
                },
                skillUser: {
                    include: {
                        skillList: true,
                    },
                },
            },
        });

        this.handlingErrorEmptyData(result, 'user list');

        const total = await this.prisma.userList.count({
            where: {
                OR: [
                    {
                        personalNumber: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    { personalName: { contains: search, mode: 'insensitive' } },
                    {
                        personalEmail: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    { personalUnit: { contains: search, mode: 'insensitive' } },
                    {
                        AND: [
                            {
                                personalNumber: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalName: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalEmail: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personalUnit: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
        });

        const data: ResponseDTO<UserList[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Create User List
    async createUserList(dto: UserListDTO): Promise<UserList> {
        const findUser = await this.prisma.userList.findFirst({
            where: {
                personalNumber: dto.personalNumber,
            },
        });
        if (!findUser) {
            return await this.prisma.userList.create({
                data: {
                    ...dto,
                    instagram: null,
                    facebook: null,
                    linkedIn: null,
                },
            });
        } else {
            return await this.updateUserList(dto.personalNumber, dto);
        }
    }

    //Update User List
    async updateUserList(
        personalNumber: string,
        dto: UserListDTO,
    ): Promise<UserList> {
        try {
            const findData = await this.prisma.userList.findFirst({
                where: {
                    personalNumber: personalNumber,
                },
            });
            this.handlingErrorNotFound(findData, personalNumber, 'user list');
            // if (findData.userPhoto) {
            //     unlinkSync(`./uploads/${findData.userPhoto}`);
            // }
        } catch (error) {
            // if (dto.userPhoto) {
            //     unlinkSync(`./uploads/${dto.userPhoto}`);
            // }
            // throw error;
        }

        const userList: UserList = await this.prisma.userList.update({
            where: {
                personalNumber: personalNumber,
            },
            data: {
                ...dto,
            },
        });

        return userList;
    }

    //Delete User List
    async deleteUserList(uuid: string): Promise<UserList> {
        const findData = await this.prisma.userList.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'user list');

        if (findData.userPhoto) {
            unlinkSync(`./uploads/${findData.userPhoto}`);
        }

        return await this.prisma.userList.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    //Get User Skill By Personal Number
    async getUserSkill(
        personalNumber: string,
    ): Promise<ResponseDTO<UserSkill[]>> {
        const result = await this.prisma.userSkill.findMany({
            where: {
                personalNumber: personalNumber,
            },
        });
        this.handlingErrorEmptyData(result, 'user skill');
        const total = await this.prisma.userSkill.count({
            where: {
                personalNumber: personalNumber,
            },
        });
        const data: ResponseDTO<UserSkill[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Create User Skill
    async createUserSkill(dto: UserSkillDTO): Promise<UserSkill> {
        const findData = await this.prisma.userList.findFirst({
            where: {
                personalNumber: dto.personalNumber,
            },
        });
        this.handlingErrorNotFound(findData, dto.personalNumber, 'user list');
        return await this.prisma.userSkill.create({
            data: {
                personalNumber: dto.personalNumber,
                skillId: dto.skillId,
            },
        });
    }

    //Update User Skill
    async updateUserSkill(uuid: string, dto: UserSkillDTO): Promise<UserSkill> {
        const findData = await this.prisma.userSkill.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'user skill');
        return await this.prisma.userSkill.update({
            where: {
                uuid: uuid,
            },
            data: {
                ...dto,
            },
        });
    }

    //Delete User Skill
    async deleteUserSkill(uuid: string): Promise<UserSkill> {
        const findData = await this.prisma.userSkill.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'user skill');
        return await this.prisma.userSkill.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    //Get User Interest
    async getUserInterest(
        personalNumber: string,
    ): Promise<ResponseDTO<UserInterest[]>> {
        const result = await this.prisma.userInterest.findMany({
            where: {
                personalNumber: personalNumber,
            },
        });
        this.handlingErrorEmptyData(result, 'user interest');
        const total = await this.prisma.userInterest.count({
            where: {
                personalNumber: personalNumber,
            },
        });
        const data: ResponseDTO<UserInterest[]> = {
            result: result,
            total: total,
        };
        return data;
    }

    //Create User Interest
    async createUserInterest(dto: UserInterestDTO): Promise<UserInterest> {
        const findData = await this.prisma.userList.findFirst({
            where: {
                personalNumber: dto.personalNumber,
            },
        });
        this.handlingErrorNotFound(findData, dto.personalNumber, 'user list');
        return await this.prisma.userInterest.create({
            data: {
                personalNumber: dto.personalNumber,
                interestId: dto.interestId,
            },
        });
    }

    //Update User Interest
    async updateUserInterest(
        uuid: string,
        dto: UserInterestDTO,
    ): Promise<UserInterest> {
        const findData = await this.prisma.userInterest.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'user interest');
        return await this.prisma.userInterest.update({
            where: {
                uuid: uuid,
            },
            data: {
                ...dto,
            },
        });
    }

    //Delete User Interest
    async deleteUserInterest(uuid: string): Promise<UserInterest> {
        const findData = await this.prisma.userInterest.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(findData, uuid, 'user skill');
        return await this.prisma.userInterest.delete({
            where: {
                uuid: uuid,
            },
        });
    }

    // Sign as Role
    async setSignAs(
        personalNumber: string,
        signAs: signAsDTO,
    ): Promise<boolean> {
        const user = await this.prisma.userList.findFirst({
            where: {
                personalNumber: personalNumber,
            },
        });
        this.handlingErrorNotFound(user, personalNumber, 'user');
        if (user) {
            await this.prisma.userList.update({
                where: {
                    personalNumber: user.personalNumber,
                },
                data: {
                    signAs: signAs.signAs,
                },
            });
            return true;
        } else {
            return false;
        }
    }

    async updateProfileUser(uuid: string, dto: UserInfoDTO): Promise<UserList> {
        await this.prisma.userInterest.deleteMany({
            where: {
                personalNumber: dto.personalNumber,
            },
        });
        await this.prisma.userSkill.deleteMany({
            where: {
                personalNumber: dto.personalNumber,
            },
        });
        await this.prisma.userInterest.createMany({
            data: [...dto.userInterest],
        });
        await this.prisma.userSkill.createMany({
            data: [...dto.userSkill],
        });
        return await this.prisma.userList.update({
            where: {
                uuid: uuid,
            },
            data: {
                facebook: dto.facebook,
                instagram: dto.instagram,
                linkedIn: dto.linkedIn,
                userName: dto.username,
                userPhoto: dto.userPhoto,
            },
        });
    }
}
