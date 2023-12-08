import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SharingExpDTO {
  @IsNotEmpty()
  @IsString()
  personalNumber: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  place: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  city: string;
}

export class SharingExpStatusDTO {
  @IsNotEmpty()
  @IsBoolean()
  approvalStatus: boolean;

  @IsNotEmpty()
  @IsString()
  approvedBy: string;
}
