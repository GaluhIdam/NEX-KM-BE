import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { TalkCategoryControllerInterface } from '../interfaces/talk-category.controller.interface';
import { TalkCategoryService } from '../services/talk-category.service';
import { Response } from 'express';
import { TalkCategoryDTO } from '../dtos/talk-category.dto';
import { TalkCategoryStatusDTO } from '../dtos/talk-category-status.dto';

@Controller({ path: 'api/talk-category', version: '1' })
export class TalkCategoryController
  extends BaseController
  implements TalkCategoryControllerInterface
{
  constructor(private readonly talkCategoryService: TalkCategoryService) {
    super(TalkCategoryController.name);
  }

  //Get Talk Category
  @Get()
  async getTalkCategory(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('status') status?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);

      let isActive = null;

      if (status) {
        isActive = this.validationBooleanParams(status);
      }

      const talkCategory = await this.talkCategoryService.getTalkCategory(
        page,
        limit,
        search,
        sortBy,
        isActive,
      );
      return res
        .status(200)
        .send(this.responseMessage('Talk category', 'Get', 200, talkCategory));
    } catch (error) {
      throw error;
    }
  }

  //Get Forum By Id
  @Get('/:uuid')
  async getTalkCategoryById(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const forum = await this.talkCategoryService.getTalkCategoryById(uuid);
      return res
        .status(200)
        .send(this.responseMessage('forum', 'Get by Id', 200, forum));
    } catch (error) {
      throw error;
    }
  }

  //Create Talk Category
  @Post()
  async createTalkCategory(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: TalkCategoryDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.errorsValidation(TalkCategoryDTO, dto);
      const talkCategory = await this.talkCategoryService.createTalkCategory(
        dto,
      );
      return res
        .status(201)
        .send(
          this.responseMessage('Talk category', 'Create', 201, talkCategory),
        );
    } catch (error) {
      throw error;
    }
  }

  //Update Talk Category
  @Put('/:uuid')
  async updateTalkCategory(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: TalkCategoryDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(TalkCategoryDTO, dto);
      const talkCategory = await this.talkCategoryService.updateTalkCategory(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('Talk category', 'Update', 200, talkCategory),
        );
    } catch (error) {
      throw error;
    }
  }

  //Delete Talk Category
  @Delete('/:uuid')
  async deleteTalkCategory(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const talkCategory = await this.talkCategoryService.deleteTalkCategory(
        uuid,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('Talk category', 'Delete', 200, talkCategory),
        );
    } catch (error) {
      throw error;
    }
  }

  //Update Talk Category Status
  @Put('/status/:uuid')
  async updateTalkCategoryStatus(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: TalkCategoryStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(TalkCategoryStatusDTO, dto);
      const result = await this.talkCategoryService.updateTalkCategoryStatus(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('Talk Categort', 'Update Status', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }
}
