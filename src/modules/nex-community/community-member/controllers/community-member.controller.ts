import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { CommunityMemberService } from '../services/community-member.service';
import { BaseController } from 'src/core/controllers/base.controller';
import { CommentControllerInterface } from 'src/modules/nex-talk/forum/interfaces/comment.controller.interface';
import { CommunityMemberControllerInterface } from '../interface/community-member.controller.interface';
import { CommunityMemberDTO } from '../dtos/community-member.dto';

@Controller({ path: 'api/community-member', version: '1' })
export class CommunityMemberController
  extends BaseController
  implements CommunityMemberControllerInterface
{
  constructor(private readonly communityMemberService: CommunityMemberService) {
    super(CommunityMemberController.name);
  }

  //Get Community
  @Get()
  async getCommunityMember(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('communityId') communityId: number,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);
      this.validateUUID(communityId);
      const result = await this.communityMemberService.getCommunityMember(
        page,
        limit,
        search,
        sortBy,
        communityId,
      );
      return res
        .status(200)
        .send(this.responseMessage('Community Member', 'Get', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Create Communtiy Member
  @Post()
  async createCommunityMember(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: CommunityMemberDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.errorsValidation(CommunityMemberDTO, dto);
      const result = await this.communityMemberService.createCommunityMember(
        dto,
      );
      return res
        .status(200)
        .send(this.responseMessage('Community Member', 'Create', 201, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Community
  @Put('/:uuid')
  async updateCommunityMember(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: CommunityMemberDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(uuid);
      await this.errorsValidation(CommunityMemberDTO, dto);
      const result = await this.communityMemberService.updateCommunityMember(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(this.responseMessage('Community Member', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Delete Community Member
  @Delete('/:uuid')
  async deleteCommunityMember(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateUUID(uuid);
      const result = await this.communityMemberService.deleteCommunityMember(
        uuid,
      );
      return res
        .status(200)
        .send(this.responseMessage('Community Member', 'Update', 200, result));
    } catch (error) {
      throw error;
    }
  }
}
