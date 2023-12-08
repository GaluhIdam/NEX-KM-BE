import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EbookStatusApprovalDTO {
  @IsString()
  @IsNotEmpty()
  approvalStatus: string;

  @IsString()
  @IsNotEmpty()
  approvalBy: string;

  @IsString()
  @IsOptional()
  descStatus: string;
}
