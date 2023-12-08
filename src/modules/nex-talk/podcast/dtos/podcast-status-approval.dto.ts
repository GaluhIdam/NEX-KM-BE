import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PodcastStatusApprovalDTO {
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
