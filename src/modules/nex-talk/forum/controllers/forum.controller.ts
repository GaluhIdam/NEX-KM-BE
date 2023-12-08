import {
    Controller,
    Get,
    Query,
    Res,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { ForumService } from '../services/forum.service';
import { ForumControllerInterface } from '../interfaces/forum.controller.interface';
import { Response } from 'express';
import { ForumDTO } from '../dtos/forum.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ForumStatusApprovalDTO } from '../dtos/forum-status-approval.dto';
import { ForumEditorChoiceDTO } from '../dtos/forum-editor-choice.dto';
import { ForumStatusDTO } from '../dtos/forum-status.dto';

@Controller({ path: 'api/forum', version: '1' })
export class ForumController
    extends BaseController
    implements ForumControllerInterface
{
    constructor(private readonly forumService: ForumService) {
        super(ForumController.name);
    }

    @Get('search')
    async search(
        @Res() res: Response,
        @Query('q') query: string,
    ): Promise<Response<Record<string, any>>> {
        try {
            const result = await this.forumService.search(query);

            return res
                .status(200)
                .send(this.responseMessage('forum', 'Search', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Get Forum
    @Get()
    async getForum(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('id_forum_category') id_forum_category?: number,
        @Query('search') search?: string,
        @Query('order_by') order_by?: string,
        @Query('status') status?: string,
        @Query('approval_status') approval_status?: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);

            let isActive = null;

            if (status) {
                isActive = this.validationBooleanParams(status);
            }

            const forums = await this.forumService.getForum(
                page,
                limit,
                id_forum_category,
                search,
                order_by,
                isActive,
                approval_status,
            );
            return res
                .status(200)
                .send(this.responseMessage('forum', 'Get', 201, forums));
        } catch (error) {
            throw error;
        }
    }

    //Get Forum Statistic
    @Get('/statistic')
    async getForumStatistic(
        @Res() res: Response<any, Record<string, any>>,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const forums = await this.forumService.getForumStatistic();
            return res
                .status(200)
                .send(
                    this.responseMessage('Forum Statistic', 'Get', 200, forums),
                );
        } catch (error) {
            throw error;
        }
    }

    //Get Forum By Id
    @Get('/:uuid')
    async getForumById(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const forum = await this.forumService.getForumById(uuid);
            return res
                .status(200)
                .send(this.responseMessage('forum', 'Get by Id', 200, forum));
        } catch (error) {
            throw error;
        }
    }

    //Create Forum
    @Post()
    @UseInterceptors(
        FileInterceptor('media', {
            storage: diskStorage({
                destination: './uploads/forum/media',
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
    async createForum(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: any,
        @UploadedFile() media?: Express.Multer.File,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (media) {
                this.validateSingleImage(media);
            }
            await this.checkPoint(
                'Create Forum',
                dto.personalNumber,
                dto.status,
            );
            const data: ForumDTO = {
                personalNumber: dto.personalNumber,
                talkCategoryId: Number(dto.talkCategoryId),
                title: dto.title,
                description: dto.description,
                name: media ? media.filename : '-',
                path: media ? `forum/media/${media.filename}` : '-',
                createdBy: dto.createdBy,
                unit: dto.unit,
            };
            await this.errorsValidation(ForumDTO, data, media);
            const forum = await this.forumService.createForum(data);
            return res
                .status(201)
                .send(this.responseMessage('forum', 'Create', 201, forum));
        } catch (error) {
            throw error;
        }
    }

    //Update Forum
    @Put('/:uuid')
    @UseInterceptors(
        FileInterceptor('media', {
            storage: diskStorage({
                destination: './uploads/forum/media',
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
    async updateForum(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: any,
        @UploadedFile() media?: Express.Multer.File,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            if (media) {
                this.validateSingleImage(media);
            }
            const data: ForumDTO = {
                personalNumber: dto.personalNumber,
                talkCategoryId: Number(dto.talkCategoryId),
                title: dto.title,
                description: dto.description,
                name: media ? media.filename : '-',
                path: media ? `forum/media/${media.filename}` : '-',
                createdBy: dto.createdBy,
                unit: dto.unit,
            };
            await this.errorsValidation(ForumDTO, data, media);
            const result = await this.forumService.updateForum(uuid, data);
            return res
                .status(200)
                .send(this.responseMessage('forum', 'Update', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Delete Forum
    @Delete('/:uuid')
    async deleteForum(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.forumService.deleteForum(uuid);
            return res
                .status(200)
                .send(this.responseMessage('forum', 'Delete', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Update Forum Status
    @Put('/status/:uuid')
    async updateForumStatus(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: ForumStatusDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(ForumStatusDTO, dto);
            const result = await this.forumService.updateForumStatus(uuid, dto);
            return res
                .status(200)
                .send(
                    this.responseMessage('Forum', 'Update Status', 200, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Update Forum Status Approval
    @Put('/status-approval/:uuid')
    async updateForumStatusApproval(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: ForumStatusApprovalDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(ForumStatusApprovalDTO, dto);
            const result = await this.forumService.updateForumStatusApproval(
                uuid,
                dto,
            );

            await this.checkPoint(
                'Create Forum',
                result.personalNumber,
                dto.approvalStatus === 'Approved' ? true : false,
            );

            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Podcast',
                        'Update Approval Status',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Update Ebook Editor Choice
    @Put('/editor-choice/:uuid')
    async updateEbookEditorChoice(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: ForumEditorChoiceDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(ForumEditorChoiceDTO, dto);
            const result = await this.forumService.updateForumEditorChoice(
                uuid,
                dto,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Forum',
                        'Update Editor Choice',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }
}
