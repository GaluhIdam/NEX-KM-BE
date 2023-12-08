import { IsNotEmpty, IsString } from 'class-validator';

export class CommunityRoleDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
