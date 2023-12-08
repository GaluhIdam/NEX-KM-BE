import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommunityMemberDTO {
  @IsNumber()
  @IsNotEmpty()
  communityId: number;

  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  personalName: string;

  @IsString()
  @IsNotEmpty()
  personalUnit: string;

  @IsString()
  @IsNotEmpty()
  personalEmail: string;

  @IsNumber()
  @IsNotEmpty()
  communityRoleId: number;
}
