import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ForumCommentChildShowDTO {
    @IsBoolean()
    @IsNotEmpty()
    isChildCommentShow: boolean;
}
