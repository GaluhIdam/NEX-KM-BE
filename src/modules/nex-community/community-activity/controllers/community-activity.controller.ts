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
import { CommunityActivityService } from '../services/community-activity.service';
import { BaseController } from 'src/core/controllers/base.controller';
import { CommunityActivityControllerInterface } from '../interface/community-activity.controller.interface';
import { Response } from 'express';
import { CommunityActivityDTO } from '../dtos/community-activity.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller({ path: 'api/community-activity', version: '1' })
export class CommunityActivityController
    extends BaseController
    implements CommunityActivityControllerInterface
{
    constructor(
        private readonly communityActivityService: CommunityActivityService,
    ) {
        super(CommunityActivityController.name);
    }

    @Get('activity-by-user')
    async getActivityByUserMember(
        @Res() res: Response<any, Record<string, any>>,
        @Query('personalNumber') personalNumber: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.communityActivityService.getActivityByUserMember(
                    personalNumber,
                    page,
                    limit,
                );
            return res
                .status(200)
                .send(this.responseMessage('activity', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Get('search')
    async search(
        @Res() res: Response,
        @Query('q') query: string,
    ): Promise<Response<Record<string, any>>> {
        try {
            const result = await this.communityActivityService.search(query);

            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'community activities',
                        'Search',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Get Community Activity With communityId
    @Get('get-with')
    async getCommunityActivityByCommunity(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('sortBy') sortBy: string,
        @Query('communityId') communityId: number,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            const result =
                await this.communityActivityService.getCommunityActivityByCommunity(
                    page,
                    limit,
                    search,
                    sortBy,
                    communityId,
                );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Community Activity',
                        'Get',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Get Activity By Id
    @Get('/:uuid')
    async getActivityById(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.communityActivityService.geeActivityById(
                uuid,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'community activity',
                        'Get',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Get Community Activity
    @Get()
    async getCommunityActivity(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('sortBy') sortBy: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            const result =
                await this.communityActivityService.getCommunityActivity(
                    page,
                    limit,
                    search,
                    sortBy,
                );
            return res
                .status(200)
                .send(this.responseMessage('community', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/community/activity',
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
    async createCommunityActivity(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: any,
        @UploadedFile() image: Express.Multer.File,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validateSingleImage(image);
            const data: CommunityActivityDTO = {
                communityId: Number(dto.communityId),
                title: dto.title,
                description: dto.description,
                personalNumber: dto.personalNumber,
                photo: image.filename,
                path: `community/activity/${image.filename}`,
                personalName: dto.personalName,
            };
            await this.errorsValidation(CommunityActivityDTO, data, image);
            const result =
                await this.communityActivityService.createCommunityActivity(
                    data,
                );
            return res
                .status(201)
                .send(this.responseMessage('community', 'Create', 201, result));
        } catch (error) {
            throw error;
        }
    }

    //Update Community Activity
    @Put('/:uuid')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/community/activity',
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
    async updateCommunityActivity(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: any,
        @UploadedFile() image: Express.Multer.File,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            this.validateSingleImage(image);
            const data: CommunityActivityDTO = {
                communityId: Number(dto.communityId),
                title: dto.title,
                description: dto.description,
                personalNumber: dto.personalNumber,
                photo: image.filename,
                path: `community/activity/${image.filename}`,
                personalName: dto.personalName,
            };
            await this.errorsValidation(CommunityActivityDTO, data, image);
            const result =
                await this.communityActivityService.updateCommunityActivity(
                    uuid,
                    data,
                );
            return res
                .status(200)
                .send(this.responseMessage('community', 'Update', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Delete Community Activity
    @Delete('/:uuid')
    async deleteCommunityActivity(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result =
                await this.communityActivityService.deleteCommunityActivity(
                    uuid,
                );
            return res
                .status(200)
                .send(this.responseMessage('community', 'Delete', 200, result));
        } catch (error) {
            throw error;
        }
    }
}
