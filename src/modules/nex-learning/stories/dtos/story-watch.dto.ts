import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StoryWatchDTO {
  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsNumber()
  @IsNotEmpty()
  storyId: number;
}
