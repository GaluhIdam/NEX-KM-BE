import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SerieStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
