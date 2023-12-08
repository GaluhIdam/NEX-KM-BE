import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommunityFollowDTO {
  @IsNumber()
  @IsNotEmpty()
  communityId: number;

  @IsString()
  @IsNotEmpty()
  personalNumber: string;
}
