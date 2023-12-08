import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PodcastStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
