import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BestPracticeDTO {
  @IsNotEmpty()
  @IsString()
  personalNumber: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  image: string;

  path: string;

  @IsNotEmpty()
  @IsString()
  uploadBy: string;

  @IsNotEmpty()
  @IsString()
  unit: string;
}

export class BestPracticeApproveDTO {
  @IsBoolean()
  @IsNotEmpty()
  approvalStatus: boolean | null;

  @IsOptional()
  approvalDesc: string | null;

  @IsString()
  @IsNotEmpty()
  approvalBy: string | null;
}

export class BestPracticeUpdateDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}

export class CommentLikeBestPracticeDTO {
  @IsNotEmpty()
  @IsNumber()
  bestPracticeId: number;

  @IsNotEmpty()
  @IsNumber()
  commentBestPracticeId: number;

  @IsNotEmpty()
  @IsBoolean()
  likeOrdislike: boolean;

  @IsNotEmpty()
  @IsString()
  personalNumber: string;
}

export class StatisticBestPracticeDTO {
  allTime: number;
  thisMonth: number;
  published: number;
  needApproval: number;
  percent: number;
}
