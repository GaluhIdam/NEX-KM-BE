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
    UploadedFiles,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { PodcastControllerInterface } from '../interfaces/podcast.controller.interface';
import { Queue } from 'bull';
import { PodcastService } from '../services/podcast.service';
import { InjectQueue } from '@nestjs/bull';
import { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { PodcastDTO } from '../dtos/podcast.dto';
import { unlinkSync } from 'fs';
import { PodcastStatusApprovalDTO } from '../dtos/podcast-status-approval.dto';
import { PodcastEditorChoiceDTO } from '../dtos/podcast-editor-choice.dto';
import { PodcastStatusDTO } from '../dtos/podcast-status.dto';

@Controller({ path: 'api/podcast', version: '1' })
export class PodcastController
    extends BaseController
    implements PodcastControllerInterface
{
    constructor(
        @InjectQueue('podcast-upload') private readonly audiouploadQueue: Queue,
        private readonly podcastService: PodcastService,
    ) {
        super(PodcastController.name);
    }

    @Get('search')
    async search(
        @Res() res: Response<Record<string, any>>,
        @Query('q') query: string,
    ): Promise<Response<Record<string, any>>> {
        try {
            const result = await this.podcastService.search(query);

            return res
                .status(200)
                .send(this.responseMessage('podcast', 'Search', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Get Podcast
    @Get()
    async getPodcast(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('order_by') orderBy?: string,
        @Query('personal_number') personalNumber?: string,
        @Query('serie_id') serieId?: string,
        @Query('status') status?: string,
        @Query('approval_status') approvalStatus?: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);

            let isActive = null;

            if (status) {
                isActive = this.validationBooleanParams(status);
            }

            const podcasts = await this.podcastService.getPodcast(
                page,
                limit,
                search,
                orderBy,
                personalNumber,
                Number(serieId),
                isActive,
                approvalStatus,
            );
            return res
                .status(200)
                .send(this.responseMessage('podcast', 'Get', 200, podcasts));
        } catch (error) {
            throw error;
        }
    }

    //Get Podcast Statistic
    @Get('/statistic')
    async getPodcastStatistic(
        @Res() res: Response<any, Record<string, any>>,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const podcasts = await this.podcastService.getPodcastStatistic();
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Podcast Statistic',
                        'Get',
                        200,
                        podcasts,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    @Get('/:uuid')
    async getPodcastById(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.podcastService.getPodcastById(uuid);
            return res
                .status(200)
                .send(
                    this.responseMessage('podcast', 'Get by Id', 200, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Create Podcast
    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'file_podcast', maxCount: 1 },
                { name: 'cover_podcast', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    filename: (req, file, cb) => {
                        const randomNameFile =
                            Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const extensionFile = extname(file.originalname);
                        const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
                        cb(null, fileName);
                    },
                    destination: (req, file, cb) => {
                        let destination: any;
                        if (file.fieldname === 'file_podcast') {
                            destination = './uploads/podcast/file';
                        } else if (file.fieldname === 'cover_podcast') {
                            destination = './uploads/podcast/cover';
                        }
                        cb(null, destination);
                    },
                }),
            },
        ),
    )
    async createPodcast(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: any,
        @UploadedFiles()
        files: {
            file_podcast: Express.Multer.File;
            cover_podcast: Express.Multer.File;
        },
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (files.cover_podcast && files.file_podcast) {
                this.validateSingleImage(files.cover_podcast[0]);
                this.validateAudio(files.file_podcast[0]);
                await this.checkPoint(
                    'Create Podcast',
                    dto.personalNumber,
                    dto.status,
                );

                const data: PodcastDTO = {
                    seriesId: Number(dto.seriesId),
                    title: dto.title,
                    description: dto.description,
                    personalNumber: dto.personalNumber,
                    createdBy: dto.createdBy,
                    image: files.cover_podcast[0].filename,
                    pathImage: `podcast/cover/${files.cover_podcast[0].filename}`,
                    file: files.file_podcast[0].filename,
                    pathFile: `podcast/file/${files.file_podcast[0].filename
                        .split('.')
                        .slice(0, -1)
                        .join('.')}/${files.file_podcast[0].filename}`,
                };
                await this.errorsValidation(
                    PodcastDTO,
                    data,
                    files.file_podcast[0],
                );
                const createData = await this.podcastService.createPodcast(
                    data,
                );
                const basePath = `./uploads/podcast/file/${files.file_podcast[0].filename
                    .split('.')
                    .slice(0, -1)
                    .join('.')}`;
                fs.mkdirSync(basePath, { recursive: true });
                fs.rename(
                    files.file_podcast[0].path,
                    `${basePath}/${files.file_podcast[0].filename}`,
                    (err) => {
                        if (err) {
                            throw err;
                        }
                    },
                );
                // const fileProcess: JobInterface = {
                //   inputPath: `./uploads/podcast/file/${files.file_podcast[0].filename
                //     .split('.')
                //     .slice(0, -1)
                //     .join('.')}/${files.file_podcast[0].filename}`,
                //   outputPath: basePath,
                // };
                // await this.audiouploadQueue.add('transcode', fileProcess);
                return res
                    .status(201)
                    .send(
                        this.responseMessage(
                            'podcast',
                            'Create',
                            201,
                            createData,
                        ),
                    );
            }
            if (!files.cover_podcast && !files.file_podcast) {
                throw new BadRequestException('Image and Audio is required!');
            }
            if (files.cover_podcast && !files.file_podcast) {
                this.validateSingleImage(files.cover_podcast[0]);
                unlinkSync(files.cover_podcast[0].path);
                throw new BadRequestException('Audio is required!');
            }
            if (files.file_podcast && !files.cover_podcast) {
                this.validateAudio(files.file_podcast[0]);
                unlinkSync(files.file_podcast[0].path);
                throw new BadRequestException('Image is required!');
            }
        } catch (error) {
            throw error;
        }
    }

    //Update Podcast
    @Put('/:uuid')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'file_podcast', maxCount: 1 },
                { name: 'cover_podcast', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    filename: (req, file, cb) => {
                        const randomNameFile =
                            Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const extensionFile = extname(file.originalname);
                        const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
                        cb(null, fileName);
                    },
                    destination: (req, file, cb) => {
                        let destination: any;
                        if (file.fieldname === 'file_podcast') {
                            destination = './uploads/podcast/file';
                        } else if (file.fieldname === 'cover_podcast') {
                            destination = './uploads/podcast/cover';
                        }
                        cb(null, destination);
                    },
                }),
            },
        ),
    )
    async updatePodcast(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: any,
        @UploadedFiles()
        files: {
            file_podcast: Express.Multer.File;
            cover_podcast: Express.Multer.File;
        },
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (files.cover_podcast && files.file_podcast) {
                this.isValidUUID(uuid);
                this.validateSingleImage(files.cover_podcast[0]);
                this.validateAudio(files.file_podcast[0]);
                const data: PodcastDTO = {
                    seriesId: Number(dto.seriesId),
                    title: dto.title,
                    description: dto.description,
                    personalNumber: dto.personalNumber,
                    createdBy: dto.createdBy,
                    image: files.cover_podcast[0].filename,
                    pathImage: `podcast/cover/${files.cover_podcast[0].filename}`,
                    file: files.file_podcast[0].filename,
                    pathFile: `podcast/file/${files.file_podcast[0].filename
                        .split('.')
                        .slice(0, -1)
                        .join('.')}/${files.file_podcast[0].filename}`,
                };
                this.errorsValidation(PodcastDTO, data, files.file_podcast[0]);
                const updateData = await this.podcastService.updatePodcast(
                    uuid,
                    data,
                );
                const basePath = `./uploads/podcast/file/${files.file_podcast[0].filename
                    .split('.')
                    .slice(0, -1)
                    .join('.')}`;
                fs.mkdirSync(basePath, { recursive: true });
                fs.rename(
                    files.file_podcast[0].path,
                    `${basePath}/${files.file_podcast[0].filename}`,
                    (err) => {
                        if (err) {
                            throw err;
                        }
                    },
                );
                // const fileProcess: JobInterface = {
                //   inputPath: `./uploads/podcast/file/${files.file_podcast[0].filename
                //     .split('.')
                //     .slice(0, -1)
                //     .join('.')}/${files.file_podcast[0].filename}`,
                //   outputPath: basePath,
                // };
                // await this.audiouploadQueue.add('transcode', fileProcess);
                return res
                    .status(200)
                    .send(
                        this.responseMessage(
                            'podcast',
                            'Update',
                            200,
                            updateData,
                        ),
                    );
            }
            if (!files.cover_podcast && !files.file_podcast) {
                throw new BadRequestException('Image and Audio is required!');
            }
            if (files.cover_podcast) {
                this.validateSingleImage(files.cover_podcast[0]);
                unlinkSync(files.cover_podcast[0].path);
                throw new BadRequestException('Audio is required!');
            }
            if (files.file_podcast) {
                this.validateAudio(files.file_podcast[0]);
                unlinkSync(files.file_podcast[0].path);
                throw new BadRequestException('Image is required!');
            }
        } catch (error) {
            throw error;
        }
    }

    //Delete Podcast
    @Delete('/:uuid')
    async deletePodcast(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.podcastService.deletePodcast(uuid);
            return res
                .status(200)
                .send(this.responseMessage('podcast', 'Delete', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Update Podcast Status
    @Put('/status/:uuid')
    async updatePodcastStatus(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: PodcastStatusDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(PodcastStatusDTO, dto);
            const result = await this.podcastService.updatePodcastStatus(
                uuid,
                dto,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Podcast',
                        'Update Status',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Update Podcast Status Approval
    @Put('/status-approval/:uuid')
    async updatePodcastStatusApproval(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: PodcastStatusApprovalDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(PodcastStatusApprovalDTO, dto);
            const result =
                await this.podcastService.updatePodcastStatusApproval(
                    uuid,
                    dto,
                );

            await this.checkPoint(
                'Create Podcast',
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

    //Update Podcast Editor Choice
    @Put('/editor-choice/:uuid')
    async updatePodcastEditorChoice(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: PodcastEditorChoiceDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(PodcastEditorChoiceDTO, dto);
            const result = await this.podcastService.updatePodcastEditorChoice(
                uuid,
                dto,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Podcast',
                        'Update Editor Choice',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Play Podcast
    @Put('/play/:uuid')
    async playPodcast(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.podcastService.playPodcast(uuid);
            return res
                .status(200)
                .send(this.responseMessage('Podcast', 'Play', 200, result));
        } catch (error) {
            throw error;
        }
    }
}
