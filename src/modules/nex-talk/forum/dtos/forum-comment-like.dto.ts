import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ForumCommentLikeDTO {
    @IsString()
    @IsNotEmpty()
    personalNumber: string;

    @IsBoolean()
    @IsNotEmpty()
    likeOrdislike: boolean;

    @IsNumber()
    @IsNotEmpty()
    forumId: number;

    @IsNumber()
    @IsNotEmpty()
    commentForumId: number;
}
