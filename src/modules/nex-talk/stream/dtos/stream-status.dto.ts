import { IsBoolean, IsNotEmpty } from 'class-validator';

export class StreamStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
