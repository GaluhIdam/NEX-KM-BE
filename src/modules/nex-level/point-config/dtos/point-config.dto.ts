import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PointConfigDTO {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @IsNotEmpty()
  point: number;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @IsString()
  @IsNotEmpty()
  activity: string;
}
