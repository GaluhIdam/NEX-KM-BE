import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PracticeCommentDTO {
    @IsNotEmpty()
    @IsNumber()
    articleId: number

    @IsNotEmpty()
    @IsString()
    personalNumber: string

    @IsNotEmpty()
    @IsString()
    comment: string

    parentId: number
}