import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SliderDTO {
  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  backgroundImage: string;

  @IsNumber()
  @IsNotEmpty()
  sequence: number;

  @IsString()
  @IsNotEmpty()
  uploadedBy: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
