import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class StoryDTO {

  @IsNotEmpty()
  @IsString()
  category: string

  @IsNotEmpty()
  @IsString()
  uploadBy: string

  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  personalNumber: string

  @IsNotEmpty()
  @IsString()
  unit: string

  cover: string;
  video: string

  path: string
}

export class StatisticStoryDTO {
  allTime: number;
  thisMonth: number;
  published: number;
  needApproval: number;
  percent: number;
}