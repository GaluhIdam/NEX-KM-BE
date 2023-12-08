import { IsBoolean, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class StoryStatusDTO {
    @IsBoolean()
    @IsNotEmpty()
    approvalStatus: boolean

    @IsString()
    @IsOptional()
    approvalBy: string

    @IsOptional()
    approvalDesc: string
}

export class StoryStatusOnlyDTO {
    @IsBoolean()
    @IsNotEmpty()
    status: boolean
}