import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class StreamDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  personalNumber: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsString()
  pathThumbnail: string;

  @IsOptional()
  @IsString()
  video: string;

  @IsOptional()
  @IsString()
  pathVideo: string;

  @IsNumber()
  @IsNotEmpty()
  talkCategoryId: number;

  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @IsNotEmpty()
  @IsString()
  unit: string;
}

export class StreamSearchResultDTO {
  hits: {
    total: number;
    hits: Array<{ _source: StreamDTO }>;
  };
}
