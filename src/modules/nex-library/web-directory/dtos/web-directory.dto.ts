import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WebDirectoryDTO {
  @IsNotEmpty()
  @IsNumber()
  id_unit_dinas: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsString()
  cover: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  personalNumber: string;
}

export class WebdirSearchResultDTO {
  hits: {
    total: number;
    hits: Array<{ _source: WebDirectoryDTO }>;
  };
}
