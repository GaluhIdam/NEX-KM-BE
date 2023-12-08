import { IsNotEmpty, IsString } from "class-validator";

export class UnitDinasDTO {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    code: string

    @IsNotEmpty()
    @IsString()
    personalNumber: string
}