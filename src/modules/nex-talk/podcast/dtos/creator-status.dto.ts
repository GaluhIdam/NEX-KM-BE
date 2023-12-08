import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatorStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
