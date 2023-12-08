import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PodcastDTO {
  @IsNumber()
  @IsNotEmpty()
  seriesId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  pathImage: string;

  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  file: string;

  @IsString()
  @IsNotEmpty()
  pathFile: string;
}

export class PodcastSearchResultDTO {
  hits: {
    total: number;
    hits: Array<{ _source: PodcastDTO }>;
  };
}
