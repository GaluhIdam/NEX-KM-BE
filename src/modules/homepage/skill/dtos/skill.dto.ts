import { IsNotEmpty, IsString } from 'class-validator';

export class SkillDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
