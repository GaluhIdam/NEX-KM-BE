import {
  IsBoolean,
  IsDateString,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class RedeemDTO {
  @IsNumber()
  @IsNotEmpty()
  merchandiseId: number;

  @IsNumberString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  personalName: string;

  @IsString()
  @IsNotEmpty()
  personalEmail: string;

  @IsString()
  @IsNotEmpty()
  personalUnit: string;
}

export class RedeedUpdateDTO {
  @IsNumber()
  @IsNotEmpty()
  merchandiseId: number;

  @IsNumberString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  personalName: string;

  @IsString()
  @IsNotEmpty()
  personalEmail: string;

  @IsString()
  @IsNotEmpty()
  personalUnit: string;

  @IsNotEmpty()
  redeemDate: string;

  claimStatus: boolean;

  status: boolean;
}
