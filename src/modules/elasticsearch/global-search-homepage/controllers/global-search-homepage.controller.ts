import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { GlobalSearchHomepageService } from '../services/global-search-homepage.service';
import { GlobalSearchHomepageControllerInterface } from '../interfaces';
import { Response } from 'express';
import { BaseController } from 'src/core/controllers/base.controller';
import { GlobalSearchResultDTO, LastSortDTO } from '../dtos/global-search.dto';

@Controller({ version: '1', path: 'global-search-homepage' })
export class GlobalSearchHomepageController
  extends BaseController
  implements GlobalSearchHomepageControllerInterface {
  constructor(
    private readonly globalSearchHomepageService: GlobalSearchHomepageService,
  ) {
    super(GlobalSearchHomepageController.name);
  }

  @Get()
  async globalSearch(
    @Res() res: Response<Record<string, any>>,
    @Query('q') query: string,
    @Body() lastSort: LastSortDTO,
  ): Promise<Response<Record<string, any>>> {
    try {
      const result: GlobalSearchResultDTO =
        await this.globalSearchHomepageService.globalSearch(query, lastSort);

      return res.status(200).send(result);
    } catch (error) {
      throw error;
    }
  }

  @Get('trendings')
  async getTrendingSearch(@Res() res: Response<any, Record<string, any>>): Promise<Response<any, Record<string, any>>> {
    try {
      const result: string[] = await this.globalSearchHomepageService.getTrendingSearch();

      return res.status(200).send(this.responseMessage('Trendings', 'Get', 200, result))
    } catch (error) {
      throw error
    }
  }
}
