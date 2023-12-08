import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StreamStatusApprovalDTO {
  @IsString()
  @IsNotEmpty()
  approvalStatus: string;

  @IsString()
  @IsNotEmpty()
  approvalBy: string;

  @IsString()
  @IsOptional()
  approvalMessage: string;
}
