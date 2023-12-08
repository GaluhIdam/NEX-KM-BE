import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class EbookDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    synopsis: string;

    @IsNotEmpty()
    @IsString()
    overview: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    about_author: string;

    @IsString()
    @IsNotEmpty()
    personalNumber: string;

    @IsNotEmpty()
    @IsString()
    upload_by: string;

    @IsOptional()
    path_cover: string;

    @IsOptional()
    path_ebook: string;

    @IsNotEmpty()
    @IsString()
    unit: string;

    @IsNotEmpty()
    @IsNumber()
    ebook_category: number;

    @IsOptional()
    ebook_file: string;

    @IsOptional()
    ebook_cover: string;
}

export class EbookSearchResultDTO {
    hits: {
        total: number;
        hits: Array<{ _source: EbookDTO }>;
    };
}

export class QueryParamsDto {
    personnelNumber: string;
    author: string;

    @Type(() => Number)
    category: number;
    uploadedBy: string;
    unit: string;
    approvalStatus: string;
    approvedBy: string;

    @Transform((params: TransformFnParams) =>
        params.value === 'true'
            ? true
            : params.value === 'false'
                ? false
                : params.value,
    )
    status: boolean;

    startDate: string;
    endDate: string;
}
