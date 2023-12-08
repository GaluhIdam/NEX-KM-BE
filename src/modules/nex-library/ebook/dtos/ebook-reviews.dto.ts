import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EbookReviewsDTO {
  @IsNotEmpty()
  @IsNumber()
  ebookId: number;


  @IsNotEmpty()
  @IsString()
  personalNumber: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  rate: number;
}