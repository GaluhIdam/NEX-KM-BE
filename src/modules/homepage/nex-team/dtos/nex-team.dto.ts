import { PartialType } from '@nestjs/mapped-types';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsInt,
  IsOptional,
} from 'class-validator';

export class NexTeamDTO {
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  uuid: string;

  @IsString()
  @IsNotEmpty()
  personnelNumber: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  createdAt: Date;
  updatedAt: Date;
}

export class CreateNexTeamDTO {
  @IsString()
  @IsNotEmpty()
  personnelNumber: string;

  @IsString()
  @IsNotEmpty()
  position: string;
}

export class UpdateNexTeamDTO extends PartialType(CreateNexTeamDTO) {}

export class GetUsersQueryDTO {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  limit: number;

  @IsString()
  @IsOptional()
  @Transform((params: TransformFnParams) => params.value)
  search: string;

  @IsOptional()
  sortBy:
    | 'noASC'
    | 'memberASC'
    | 'positionASC'
    | 'noDESC'
    | 'memberDESC'
    | 'positionDESC';

  @IsOptional()
  position:
    | 'Corporatee Culture & Knowledge Management'
    | 'Learning Center Unit'
    | 'IT Developer';
}
