import { PartialType, PickType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateNotifDTO {
    @IsString()
    @IsNotEmpty()
    senderPersonalNumber: string;

    @IsString()
    @IsNotEmpty()
    receiverPersonalNumber: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    contentType: string;

    @IsString()
    @IsNotEmpty()
    contentUuid: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) =>
        value === 'true' ? true : value === 'false' ? false : value,
    )
    isRead: boolean;
}

export class UpdateNotifDTO extends PartialType(CreateNotifDTO) {}

export class ReadNotifDTO extends PickType(CreateNotifDTO, [
    'isRead',
] as const) {}

export class GetUsersQueryDTO {
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    page: number;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    limit: number;
}
