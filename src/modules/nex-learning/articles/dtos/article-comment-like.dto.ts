import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ArticleCommentLikeDTO {
    @IsNotEmpty()
    @IsNumber()
    articleId: number

    @IsNotEmpty()
    @IsNumber()
    commentArticleId: number
    
    @IsNotEmpty()
    @IsString()
    personalNumber: string

    @IsNotEmpty()
    @IsBoolean()
    likeOrdislike: boolean

}