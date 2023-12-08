import { IsBoolean, IsNotEmpty } from 'class-validator';

export class AlbumStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
