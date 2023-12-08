import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatorDTO {
  @IsNumber()
  @IsNotEmpty()
  talkCategoryId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

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
  @IsString()
  personalNumber: string;

  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @IsNotEmpty()
  @IsString()
  unit: string;
}
