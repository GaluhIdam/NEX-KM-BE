import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommunityActivityDTO {
  @IsNotEmpty()
  @IsNumber()
  communityId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  personalNumber: string;

  @IsNotEmpty()
  @IsString()
  personalName: string;

  photo: string;
  path: string;
}

export class CommunityActivitySearchResultDTO {
  hits: {
    total: number;
    hits: Array<{ _source: CommunityActivityDTO }>;
  };
}
