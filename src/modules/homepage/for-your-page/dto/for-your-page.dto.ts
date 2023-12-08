import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ForYourPageDTO {
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    personalNumber: string;

    @IsString()
    @IsNotEmpty()
    personalName: string;

    @IsString()
    @IsNotEmpty()
    path: string;

    @IsString()
    @IsNotEmpty()
    link: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsNumber()
    @IsNotEmpty()
    idContent: number;

    cover: string | null;
}
