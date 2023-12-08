import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class PracticeStatusDTO {
    @IsBoolean()
    @IsNotEmpty()
    status: boolean

    @IsOptional()
    descStatus: string
}