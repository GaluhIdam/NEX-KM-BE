import {
    Controller,
    Res,
    Query,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { EbookCategoryControllerInterface } from '../interfaces/ebook-category.controller.interface';
import { EbookCategoryService } from '../services/ebook-category.service';
import { EbookCategoryDTO } from '../dtos/ebook-category.dto';
import { BaseController } from 'src/core/controllers/base.controller';
import { EbookCategoryStatusDTO } from '../dtos/ebook-category-status.dto';

@Controller({ path: 'api/ebook-category', version: '1' })
export class EbookCategoryController
    extends BaseController
    implements EbookCategoryControllerInterface
{
    constructor(private readonly ebookcategoryService: EbookCategoryService) {
        super(EbookCategoryController.name);
    }

    //GET Ebook Category
    @Get()
    async getEbookCategory(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search?: string,
        @Query('is_active') is_active?: string,
        @Query('sort_by') sort_by?: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            let isActive = null;

            if (is_active) {
                isActive = this.validationBooleanParams(is_active);
            }

            const result = await this.ebookcategoryService.getEbookCategory(
                page,
                limit,
                search,
                isActive,
                sort_by,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage('ebook category', 'Get', 200, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Create Ebook Category
    @Post()
    async createEbookCategory(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: EbookCategoryDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            await this.errorsValidation(EbookCategoryDTO, dto);
            const result = await this.ebookcategoryService.createEbookCategory(
                dto,
            );
            return res
                .status(201)
                .send(
                    this.responseMessage(
                        'ebook category',
                        'Create',
                        201,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Update Ebook Category (General)
    @Put('/:uuid')
    async updateEbookCategory(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: EbookCategoryDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(EbookCategoryDTO, dto);
            const result = await this.ebookcategoryService.updateEbookCategory(
                uuid,
                dto,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'ebook category',
                        'Update',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Update Ebook Category Status
    @Put('/status/:uuid')
    async updateEbookCategoryStatus(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: EbookCategoryStatusDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(EbookCategoryStatusDTO, dto);
            const result =
                await this.ebookcategoryService.updateEbookCategoryStatus(
                    uuid,
                    dto,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'ebook category',
                        'Update Status',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Delete Ebook Category
    @Delete('/:uuid')
    async deleteEbookCategory(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.ebookcategoryService.deleteEbookCategory(
                uuid,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'ebook category',
                        'Delete',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }
}
