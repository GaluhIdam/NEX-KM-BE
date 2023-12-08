import { IsBoolean, IsNotEmpty } from 'class-validator';

export class WebDirectoryStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
