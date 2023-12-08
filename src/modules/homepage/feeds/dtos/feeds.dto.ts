/* eslint-disable prettier/prettier */
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import * as sanitize from 'sanitize-html';

export class FeedDTO {
    image: string;
    status: boolean;
    createdAt: Date;
    title: string;
    category: string;
    personnelNumber: string;
}

export class FeedsResultDTO {
    hits: {
        total: number;
        hits: Array<{ _source: FeedDTO }>;
    };
}

export class QueryParams {
    @IsOptional()
    @IsString()
    @Transform((params: TransformFnParams) => sanitize(params.value))
    approvalStatus: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    size: number

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    page: number;

    @IsOptional()
    @IsBoolean()
    @Transform((params: TransformFnParams) =>
        params.value === 'true'
            ? true
            : params.value === 'false'
                ? false
                : params.value,
    )
    approvalStatusBool: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform((params: TransformFnParams) =>
        params.value === 'true'
            ? true
            : params.value === 'false'
                ? false
                : params.value,
    )
    status: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform((params: TransformFnParams) =>
        params.value === 'true'
            ? true
            : params.value === 'false'
                ? false
                : params.value,
    )
    bannedStatus: boolean;
}

export class FeedsBoolQuery {
    should?: (
        | {
            bool: {
                must: (
                    | {
                        match: { personalNumber: string };
                    }
                    | { match: { 'approvalStatus.keyword': string } }
                    | { term: { status: boolean } }
                )[];
            };
        }
        | {
            bool: {
                must: (
                    | { match: { personalNumber: string } }
                    | { term: { approvalStatus: boolean } }
                    | { term: { bannedStatus: boolean } }
                )[];
            };
        }
    )[];
    must?: { match: { personalNumber: string } }[];
}
