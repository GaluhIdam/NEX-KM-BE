import {
    UserList,
    UserSkill,
    UserInterest,
    FollowingFollower,
} from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import {
    UserFollowerDTO,
    UserFollowingDTO,
    UserInfoDTO,
    UserInterestDTO,
    UserListDTO,
    UserSkillDTO,
} from '../dtos/user-list.dto';

export interface UserListServiceInterface {
    //Get User By Personal Number
    getUserListByPersonalNumber(personalNumber: string): Promise<UserList>;

    //User List
    getUserList(
        page: number,
        limit: number,
        search: string,
        sortBy: string,
    ): Promise<ResponseDTO<UserList[]>>;

    createUserList(dto: UserListDTO): Promise<UserList>;

    updateUserList(personalNumber: string, dto: UserListDTO): Promise<UserList>;

    deleteUserList(uuid: string): Promise<UserList>;

    //User Skill
    getUserSkill(personalNumber: string): Promise<ResponseDTO<UserSkill[]>>;

    createUserSkill(dto: UserSkillDTO): Promise<UserSkill>;

    updateUserSkill(uuid: string, dto: UserSkillDTO): Promise<UserSkill>;

    deleteUserSkill(uuid: string): Promise<UserSkill>;

    //User Interest
    getUserInterest(
        personalNumber: string,
    ): Promise<ResponseDTO<UserInterest[]>>;

    createUserInterest(dto: UserInterestDTO): Promise<UserInterest>;

    updateUserInterest(
        uuid: string,
        dto: UserInterestDTO,
    ): Promise<UserInterest>;

    deleteUserInterest(uuid: string): Promise<UserInterest>;

    //FollowerFollowing
    getFollowing(
        page: number,
        limit: number,
        personalNumber: string,
    ): Promise<ResponseDTO<FollowingFollower[]>>;
    getFollower(
        page: number,
        limit: number,
        personalNumber: string,
    ): Promise<ResponseDTO<FollowingFollower[]>>;
    createFollowingFollower(dto: UserFollowerDTO): Promise<FollowingFollower>;
    deleteFollowingFollower(uuid: string): Promise<FollowingFollower>;

    updateProfileUser(uuid: string, dto: UserInfoDTO): Promise<UserList>;
}
