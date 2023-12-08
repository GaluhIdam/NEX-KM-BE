import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    isNumber,
} from 'class-validator';

export class UserListDTO {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsString()
    userPhoto: string;

    @IsNotEmpty()
    @IsString()
    personalNumber: string;

    @IsNotEmpty()
    @IsString()
    personalName: string;

    personalTitle: string;

    @IsNotEmpty()
    @IsString()
    personalUnit: string;

    @IsString()
    personalBirthPlace: string;

    personalBirthDate: string;
    personalGrade: string;
    personalJobDesc: string;

    @IsEmail()
    personalEmail: string;

    @IsString()
    personalImage: string;

    facebook: string;

    instagram: string;

    linkedIn: string;
    token: string;
}

export class UserSkillDTO {
    @IsNotEmpty()
    @IsString()
    personalNumber: string;

    @IsNotEmpty()
    @IsNumber()
    skillId: number;
}

export class UserInterestDTO {
    @IsNotEmpty()
    @IsString()
    personalNumber: string;

    @IsNotEmpty()
    @IsNumber()
    interestId: number;
}

export class UserFollowerDTO {
    @IsNotEmpty()
    @IsString()
    personalNumberFollower: string;

    @IsNotEmpty()
    @IsString()
    personalNumberFollowing: string;
}

export class UserFollowingDTO {
    @IsNotEmpty()
    @IsString()
    personalNumberFollower: string;

    @IsNotEmpty()
    @IsString()
    personalNumberFollowing: string;
}

export class signAsDTO {
    signAs: string | null;
}

export class UserInfoDTO {
    @IsNotEmpty()
    @IsString()
    userPhoto: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    facebook: string;

    instagram: string;

    linkedIn: string;

    @IsNotEmpty()
    @IsString()
    personalNumber: string;

    @IsNotEmpty()
    @IsArray()
    userInterest: Array<UserInterestUpdateDTO>;

    @IsNotEmpty()
    @IsArray()
    userSkill: Array<UserSkillUpdateDTO>;
}

export class UserInterestUpdateDTO {
    @IsNotEmpty()
    @IsString()
    personalNumber: string;

    @IsNotEmpty()
    @IsNumber()
    interestId: number;
}

export class UserSkillUpdateDTO {
    @IsNotEmpty()
    @IsString()
    personalNumber: string;

    @IsNotEmpty()
    @IsNumber()
    skillId: number;
}
