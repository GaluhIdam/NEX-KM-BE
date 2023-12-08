import { IsNotEmpty, IsString } from "class-validator";

export class PracticeCategoryDTO {
    @IsNotEmpty()
    @IsString()
    personalNumber: string

    @IsNotEmpty()
    @IsString()
    title: string
}