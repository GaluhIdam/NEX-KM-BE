import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ForumCommentDTO {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsNumber()
  @IsNotEmpty()
  forumId: number;

  @IsNumber()
  @IsOptional()
  parentId: number;
}
