import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AlbumStatusApprovalDTO {
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
