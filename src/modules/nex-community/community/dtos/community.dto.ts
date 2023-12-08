import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CommunityPublishDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsString()
  @IsNotEmpty()
  leader: string;

  @IsString()
  @IsNotEmpty()
  leaderProfile: string;

  @IsString()
  @IsNotEmpty()
  leaderPersonalNumber: string;

  @IsString()
  @IsNotEmpty()
  leaderUnit: string;

  @IsString()
  @IsNotEmpty()
  leaderEmail: string;

  @IsString()
  @IsNotEmpty()
  instagram: string;

  @IsNotEmpty()
  @IsString()
  founded: Date;
}

export class FileImageDTO {
  @IsNotEmpty()
  thumbnailPhotoFile: Express.Multer.File;

  @IsNotEmpty()
  headlinePhotoFile: Express.Multer.File;

  @IsNotEmpty()
  iconFile: Express.Multer.File;
}

export class PublishPrivateDTO {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}

export class CommunitySearchResultDTO {
  hits: {
    total: number;
    hits: Array<{ _source: CommunityPublishDTO }>;
  };
}
