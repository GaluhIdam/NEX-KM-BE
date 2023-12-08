import { IsNotEmpty, IsString } from 'class-validator';

export class EbookCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  personalNumber: string;
}
