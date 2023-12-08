import { Type, Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Multer } from 'multer';
import * as sanitize from 'sanitize-html';

export class MerchandiseDTO {
  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsNumber()
  @IsNotEmpty()
  point: number;

  @IsBoolean()
  @IsNotEmpty()
  isPinned: boolean;
}

export class GetUsersQueryDTO {
  @IsInt()
  @Type(() => Number)
  page: number;

  @IsInt()
  @Type(() => Number)
  limit: number;

  @IsString()
  @Transform((params: TransformFnParams) => sanitize(params.value))
  search: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  minPoints: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  maxPoints: number;

  sortBy: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  isPinned: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  isAdmin: boolean;
}

export class GetMerchDTO {
  @IsInt()
  id: number;

  @IsString()
  uuid: string;

  @IsNumberString()
  personnelNumber: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsInt()
  qty: number;

  @IsInt()
  sold: number;

  @IsInt()
  point: number;

  @IsBoolean()
  isPinned: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export class PinUnpinDTO {
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  isPinned: boolean;
}

export class MerchandiseImageDTO {
  @IsString()
  @IsNotEmpty()
  personalNumber: string;

  @IsNumber()
  @IsNotEmpty()
  merchandiseId: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  path: string;
}

export class MerchandiseSearchResultDTO {
  hits: {
    total: number;
    hits: Array<{ _source: GetMerchDTO }>;
  };
}
