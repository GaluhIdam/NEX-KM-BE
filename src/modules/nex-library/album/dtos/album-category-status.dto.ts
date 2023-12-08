import { IsBoolean, IsNotEmpty } from 'class-validator';

export class AlbumCategoryStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
