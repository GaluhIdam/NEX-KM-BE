import { IsNotEmpty, IsString } from 'class-validator';

export class InterestDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
