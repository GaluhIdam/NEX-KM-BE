import { Response } from 'express';
import {
    UserFollowerDTO,
    UserFollowingDTO,
    UserInfoDTO,
    UserInterestDTO,
    UserSkillDTO,
} from '../dtos/user-list.dto';

export interface UserListControllerInterface {
    //Get User By PersonalNumber
    getUserListByPersonalNumber(
        res: Response,
        personalNumber: string,
    ): Promise<Response>;

    //User List
    getUserList(
        res: Response,
        page: number,
        limit: number,
        search: string,
        sortBy: string,
    ): Promise<Response>;

    createUserList(
        res: Response,
        userPhoto: Express.Multer.File,
        dto: any,
    ): Promise<Response>;

    updateUserList(
        res: Response,
        personalNumber: string,
        dto: any,
        userPhoto: Express.Multer.File,
    ): Promise<Response>;

    deleteUserList(res: Response, uuid: string): Promise<Response>;

    //UserSkill
    getUserSkill(res: Response, personalNumber: string): Promise<Response>;

    createUserSkill(res: Response, dto: UserSkillDTO): Promise<Response>;

    updateUserSkill(
        res: Response,
        uuid: string,
        dto: UserSkillDTO,
    ): Promise<Response>;

    deleteUserSkill(res: Response, uuid: string): Promise<Response>;

    checker(
        res: Response,
        follower: string,
        following: string,
    ): Promise<Response>;

    //User Interest
    getUserInterest(res: Response, personalNumber: string): Promise<Response>;

    createUserInterest(res: Response, dto: UserInterestDTO): Promise<Response>;

    updateUserInterest(
        res: Response,
        uuid: string,
        dto: UserInterestDTO,
    ): Promise<Response>;

    deleteUserInterest(res: Response, uuid: string): Promise<Response>;

    //FollowerFollowing
    getFollowing(
        res: Response,
        page: number,
        limit: number,
        personalNumber: string,
    ): Promise<Response>;
    getFollower(
        res: Response,
        page: number,
        limit: number,
        personalNumber: string,
    ): Promise<Response>;
    createFollowingFollower(
        res: Response,
        dto: UserFollowerDTO,
    ): Promise<Response>;
    deleteFollowingFollower(res: Response, uuid: string): Promise<Response>;

    updateProfileUser(
        res: Response,
        uuid: string,
        dto: UserInfoDTO,
        image: Express.Multer.File,
    ): Promise<Response>;
}
