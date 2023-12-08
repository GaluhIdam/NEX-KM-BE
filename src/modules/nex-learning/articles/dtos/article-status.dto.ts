import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ArticleStatusDTO {
    @IsBoolean()
    @IsNotEmpty()
    status: boolean;

    @IsOptional()
    approvalBy: string;

    @IsOptional()
    descStatus: string;
    
    @IsOptional()
    approvalByPersonalNumber: string;
}
