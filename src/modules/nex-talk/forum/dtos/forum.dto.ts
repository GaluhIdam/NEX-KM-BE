import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ForumDTO {
  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsNumber()
  @IsNotEmpty()
  talkCategoryId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  path: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  unit: string;
}

export class ForumSearchResultDTO {
  hits: {
    total: number;
    hits: Array<{ _source: ForumDTO }>;
  };
}
