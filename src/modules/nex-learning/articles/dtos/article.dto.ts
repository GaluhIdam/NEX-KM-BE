import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class ArticleDTO {
    @IsNotEmpty()
    @IsString()
    personalNumber: string;

    @IsNotEmpty()
    @IsNumber()
    articleCategoryId: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsString()
    path: string;

    @IsNotEmpty()
    @IsString()
    uploadBy: string;

    @IsNotEmpty()
    @IsString()
    unit: string;

    @IsOptional()
    @IsString()
    approvalBy: string;

    @IsOptional()
    @IsBoolean()
    editorChoice: boolean;

    @IsOptional()
    @IsBoolean()
    statusPublish: boolean;

    @IsOptional()
    @IsBoolean()
    approvalStatus: boolean;

    @IsOptional()
    @IsString()
    approvalDesc: string;

    @IsOptional()
    @IsString()
    bannedDesc: boolean;

    @IsOptional()
    @IsBoolean()
    bannedStatus: boolean;
}

export class StatisticArticleDTO {
    allTime: number;
    thisMonth: number;
    published: number;
    needApproval: number;
    percent: number;
}

export class ArticleSearchResultDTO {
    hits: {
        total: number;
        hits: Array<{ _source: ArticleDTO }>;
    };
}
