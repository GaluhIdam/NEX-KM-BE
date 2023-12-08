import { IsNotEmpty, IsString } from 'class-validator';

export class AlbumCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  personalNumber: string;
}
