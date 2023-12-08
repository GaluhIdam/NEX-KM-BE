import { IsBoolean, IsNotEmpty } from 'class-validator';

export class EbookStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
