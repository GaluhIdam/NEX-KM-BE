import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { ArticleCategoryControllerInterface } from '../interfaces/article-category.controller.interface';
import { ArticleCategoryService } from '../services/article-category.service';
import { Response } from 'express';
import { ArticleCategoryDTO, ArticleCategoryStatusDTO } from '../dtos/article-category.dto';

@Controller({ path: 'api/article-category', version: '1' })
export class ArticleCategoryController extends BaseController implements ArticleCategoryControllerInterface {
    constructor(
        private readonly articlecategoryService: ArticleCategoryService
    ) {
        super(ArticleCategoryController.name)
    }


    //Get Article Category
    @Get()
    async getCategoryArticle(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
        @Query('optionx') optionx?: string
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.articlecategoryService.getCategoryArticle(page, limit, search, optionx);
            return res.status(200).send(
                this.responseMessage('category article', 'Get', 200, result)
            );
        } catch (error) {
            throw error;
        }
    }

    //Create Article Category
    @Post()
    async createCategoryArticle(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: ArticleCategoryDTO
    ): Promise<Response<any, Record<string, any>>> {
        try {
            await this.errorsValidation(ArticleCategoryDTO, dto);
            const result = await this.articlecategoryService.createCategoryArticle(dto);
            return res.status(201).send(
                this.responseMessage('category article', 'Create', 201, result)
            );
        } catch (error) {
            throw error;
        }
    }

    //Update Category Article
    @Put('/:uuid')
    async updateCategoryArticle(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: ArticleCategoryDTO
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(ArticleCategoryDTO, dto);
            const result = await this.articlecategoryService.updateCategoryArticle(uuid, dto);
            return res.status(200).send(
                this.responseMessage('category article', 'Update', 200, result)
            );
        } catch (error) {
            throw error;
        }
    }

    //Delete Category Article
    @Delete('/:uuid')
    async deleteCategoryArticle(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.articlecategoryService.deleteCategoryArticle(uuid);
            return res.status(200).send(result);
        } catch (error) {
            throw error;
        }
    }

    //Active or Deactive Status
    @Put('active-deactive/:uuid')
    async activeDeactive(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: ArticleCategoryStatusDTO
    ): Promise<Response<any, Record<string, any>>> {
        await this.errorsValidation(ArticleCategoryStatusDTO, dto);
        const result = await this.articlecategoryService.activeDeactive(uuid, dto);
        return res.status(200).send(
            this.responseMessage('article category', 'Update', 200, result)
        );
    }
}
