import { IsNotEmpty, IsString } from 'class-validator';

export class TalkCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
