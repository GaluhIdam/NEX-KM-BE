import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AlbumDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  categoryAlbum: number;

  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsOptional()
  album_cover: string;

  @IsString()
  @IsOptional()
  path: string;

  @IsString()
  @IsNotEmpty()
  upload_by: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @IsOptional()
  size: number;

  @IsString()
  @IsOptional()
  mimeType: string;
}

export class AlbumSearchResultDTO {
  hits: {
    total: number;
    hits: Array<{ _source: AlbumDTO }>;
  };
}
