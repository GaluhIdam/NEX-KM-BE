import { IsBoolean, IsNotEmpty } from 'class-validator';

export class TalkCategoryStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
