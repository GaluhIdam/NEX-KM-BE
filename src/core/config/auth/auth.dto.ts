import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsString()
  personalNumber: string;

  @IsEmail()
  @IsString()
  personalEmail: string;
}
