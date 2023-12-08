import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MilesDTO {
  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  minPoint: number;

  @IsNumber()
  @IsNotEmpty()
  maxPoint: number;

  @IsString()
  path: string;

  @IsBoolean()
  status: boolean;
}
