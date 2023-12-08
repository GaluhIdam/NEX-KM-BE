import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CommentBestPracticeDTO {
  @IsNotEmpty()
  @IsNumber()
  practiceId: number;

  @IsNotEmpty()
  @IsString()
  personalNumber: string;

  @IsNotEmpty()
  @IsString()
  personalName: string;

  personalNumberMention: string | null;

  personalNameMention: string | null;

  @IsNotEmpty()
  @IsString()
  comment: string;

  parentId: number | null;

  like: number;

  dislike: number;
}
