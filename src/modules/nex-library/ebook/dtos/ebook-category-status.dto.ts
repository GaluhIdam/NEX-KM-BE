import { IsBoolean, IsNotEmpty } from 'class-validator';

export class EbookCategoryStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
