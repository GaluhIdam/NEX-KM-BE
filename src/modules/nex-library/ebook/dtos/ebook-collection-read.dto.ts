import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EbookCollectionReadDTO {
  @IsNotEmpty()
  @IsString()
  personalNumber: string;

  @IsNotEmpty()
  @IsNumber()
  ebookId: number;
}
