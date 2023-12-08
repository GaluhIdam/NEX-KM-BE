import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ArticleCategoryDTO {
    @IsNotEmpty()
    @IsString()
    personalNumber: string

    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsBoolean()
    status: boolean
}

export class ArticleCategoryStatusDTO {
    @IsNotEmpty()
    @IsBoolean()
    status: boolean
}