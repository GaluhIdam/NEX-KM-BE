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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatorControllerInterface } from '../interfaces/creator.controller.interface';
import { CreatorService } from '../services/creator.service';
import { CreatorDTO } from '../dtos/creator.dto';
import { CreatorStatusDTO } from '../dtos/creator-status.dto';
import { CreatorStatusApprovalDTO } from '../dtos/creator-status-approval.dto';
import { CreatorEditorChoiceDTO } from '../dtos/creator-editor-choice.dto';

@Controller({ path: 'api/creator', version: '1' })
// @Resource(CreatorController.name)
export class CreatorController
  extends BaseController
  implements CreatorControllerInterface
{
  constructor(private readonly creatorService: CreatorService) {
    super(CreatorController.name);
  }

  //Get Creators
  @Get()
  async getCreators(
    @Res() res: Response<any, Record<string, any>>,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('order_by') order_by?: string,
    @Query('personal_number') personal_number?: string,
    @Query('approval_status') approval_status?: string,
    @Query('status') status?: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validatePageLimit(page, limit);

      let isActive = null;

      if (status) {
        isActive = this.validationBooleanParams(status);
      }
      const creators = await this.creatorService.getCreators(
        page,
        limit,
        search,
        order_by,
        personal_number,
        approval_status,
        isActive,
      );
      return res
        .status(200)
        .send(this.responseMessage('Creators', 'Get', 200, creators));
    } catch (error) {
      throw error;
    }
  }

  //Get Creator Statistic
  @Get('/statistic')
  async getCreatorStatistic(
    @Res() res: Response<any, Record<string, any>>,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const creators = await this.creatorService.getCreatorStatistic();
      return res
        .status(200)
        .send(this.responseMessage('Creator Statistic', 'Get', 200, creators));
    } catch (error) {
      throw error;
    }
  }

  //Get Creator By Uuid
  @Get('/:uuid')
  async getCreatorByUuid(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const creator = await this.creatorService.getCreatorByUuid(uuid);
      return res
        .status(200)
        .send(this.responseMessage('Creator', 'Get by Id', 200, creator));
    } catch (error) {
      throw error;
    }
  }

  //Create Creator
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/podcast/creators',
        filename: (req, file, cb) => {
          const randomNameFile =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extensionFile = extname(file.originalname);
          const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async createCreator(
    @Res() res: Response<any, Record<string, any>>,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: CreatorDTO = {
        talkCategoryId: Number(dto.talkCategoryId),
        name: dto.name,
        description: dto.description,
        image: image.filename,
        path: `podcast/creators/${image.filename}`,
        personalNumber: dto.personalNumber,
        createdBy: dto.createdBy,
        unit: dto.unit,
      };
      await this.errorsValidation(CreatorDTO, data, image);
      const creator = await this.creatorService.createCreator(data);
      return res
        .status(201)
        .send(this.responseMessage('Creator', 'Create', 201, creator));
    } catch (error) {
      throw error;
    }
  }

  //Update Creator
  @Put('/:uuid')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/podcast/creators',
        filename: (req, file, cb) => {
          const randomNameFile =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extensionFile = extname(file.originalname);
          const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async updateCreator(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.validateSingleImage(image);
      const data: CreatorDTO = {
        talkCategoryId: Number(dto.talkCategoryId),
        name: dto.name,
        description: dto.description,
        image: image.filename,
        path: `podcast/creators/${image.filename}`,
        personalNumber: dto.personalNumber,
        createdBy: dto.createdBy,
        unit: dto.unit,
      };
      await this.errorsValidation(CreatorDTO, data, image);
      const creator = await this.creatorService.updateCreator(uuid, data);
      return res
        .status(200)
        .send(this.responseMessage('Creator', 'Update', 200, creator));
    } catch (error) {
      throw error;
    }
  }

  //Delete Creator
  @Delete('/:uuid')
  async deleteCreator(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      const creator = await this.creatorService.deleteCreator(uuid);
      return res
        .status(200)
        .send(this.responseMessage('Creator', 'Delete', 200, creator));
    } catch (error) {
      throw error;
    }
  }

  //Update Creator Status
  @Put('/status/:uuid')
  async updateCreatorStatus(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: CreatorStatusDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(CreatorStatusDTO, dto);
      const result = await this.creatorService.updateCreatorStatus(uuid, dto);
      return res
        .status(200)
        .send(this.responseMessage('Creator', 'Update Status', 200, result));
    } catch (error) {
      throw error;
    }
  }

  //Update Creator Status Approval
  @Put('/status-approval/:uuid')
  async updateCreatorStatusApproval(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: CreatorStatusApprovalDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(CreatorStatusApprovalDTO, dto);
      const result = await this.creatorService.updateCreatorStatusApproval(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(
          this.responseMessage(
            'Creator',
            'Update Approval Status',
            200,
            result,
          ),
        );
    } catch (error) {
      throw error;
    }
  }

  //Update Creator Editor Choice
  @Put('/editor-choice/:uuid')
  async updateCreatorEditorChoice(
    @Res() res: Response<any, Record<string, any>>,
    @Param('uuid') uuid: string,
    @Body() dto: CreatorEditorChoiceDTO,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.isValidUUID(uuid);
      await this.errorsValidation(CreatorEditorChoiceDTO, dto);
      const result = await this.creatorService.updateCreatorEditorChoice(
        uuid,
        dto,
      );
      return res
        .status(200)
        .send(
          this.responseMessage('Creator', 'Update Editor Choice', 200, result),
        );
    } catch (error) {
      throw error;
    }
  }
}
