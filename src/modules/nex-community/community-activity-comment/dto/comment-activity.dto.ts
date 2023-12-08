import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActivityCommentDTO {
    @IsNotEmpty()
    @IsNumber()
    activityId: number;

    @IsNotEmpty()
    @IsString()
    personalNumber: string;

    @IsNotEmpty()
    @IsString()
    personalName: string;

    personalNumberMention: string | null;

    personalNameMention: string | null;

    @IsNotEmpty()
    @IsString()
    comment: string;

    parentId: number | null;

    like: number;

    dislike: number;
}
