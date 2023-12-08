import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FavoriteDTO {

    @IsNumber()
    @IsNotEmpty()
    streamId: number;

    @IsString()
    @IsNotEmpty()
    personalNumber: string;
}

export class WatchDTO {

    @IsNumber()
    @IsNotEmpty()
    streamId: number;

    @IsString()
    @IsNotEmpty()
    personalNumber: string;

}