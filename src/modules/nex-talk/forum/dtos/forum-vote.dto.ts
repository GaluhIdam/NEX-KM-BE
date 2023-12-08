import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ForumVoteDTO {
    @IsString()
    @IsNotEmpty()
    personalNumber: string;

    @IsBoolean()
    @IsNotEmpty()
    isUpvote: boolean;

    @IsNumber()
    @IsNotEmpty()
    forumId: number;
}
