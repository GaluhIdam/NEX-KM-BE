import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { SkillService } from '../services/skill.service';
import { SkillControllerInterface } from '../interfaces/skill.controller.interface';
import { Response } from 'express';
import { SkillDTO } from '../dtos/skill.dto';
import { BaseController } from 'src/core/controllers/base.controller';

@Controller({ version: '1', path: 'api/skill' })
export class SkillController
  extends BaseController
  implements SkillControllerInterface
{
  constructor(private readonly skillService: SkillService) {
    super(SkillController.name);
  }

  //Get Skill
  @Get()
  async getSkill(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      const result = await this.skillService.getSkill(
        page,
        limit,
        search,
        sortBy,
      );
      return res
        .status(200)
        .send(this.responseMessage('skill', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Get Skill By Uuid
  @Get(':uuid')
  async getSkillByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.skillService.getSkillByUuid(uuid);
      return res
        .status(200)
        .send(this.responseMessage('skill', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Skill
  @Post()
  async createSkill(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: SkillDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result = await this.skillService.createSkill(dto);
      return res
        .status(201)
        .send(this.responseMessage('skill', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Skill
  @Put(':uuid')
  async updateSkill(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: SkillDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.skillService.updateSkill(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('skill', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Skill
  @Delete(':uuid')
  async deleteSkill(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const result = await this.skillService.deleteSkill(uuid);
      return res
        .status(200)
        .send(this.responseMessage('skill', 'Delete', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
