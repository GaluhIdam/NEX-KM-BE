import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PointDTO {
  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  personalName: string;

  @IsString()
  @IsNotEmpty()
  personalUnit: string;

  title: string | null;

  personalEmail: string | null;

  @IsNumber()
  @IsNotEmpty()
  point: number;

  @IsNumber()
  @IsNotEmpty()
  totalPoint: number;
}

export class HistoryPointDTO {
  @IsNotEmpty()
  @IsString()
  personalNumber: string;

  @IsNotEmpty()
  @IsString()
  activity: string;

  @IsNotEmpty()
  @IsNumber()
  point: number;

  status: boolean | null;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  personalNumber: string;
}
