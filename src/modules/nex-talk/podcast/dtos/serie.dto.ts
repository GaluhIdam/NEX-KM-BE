import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SerieDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsNumber()
  creatorId: number;

  @IsNotEmpty()
  @IsString()
  personalNumber: string;
}
