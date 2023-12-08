import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActivityCommentLikeDTO {
    @IsNotEmpty()
    @IsNumber()
    activityId: number;

    @IsNotEmpty()
    @IsNumber()
    commentActivityId: number;

    @IsNotEmpty()
    @IsString()
    personalNumber: string;

    @IsNotEmpty()
    @IsBoolean()
    likeOrdislike: boolean;
}
