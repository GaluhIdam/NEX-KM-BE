import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Delete,
    Param,
    Post,
    Put,
    Query,
    Res,
    UploadedFiles,
    UseInterceptors,
    Logger,
} from '@nestjs/common';
import { EbookControllerInterface } from '../interfaces/ebook.controller.interface';
import { Response } from 'express';
import { EbookDTO, QueryParamsDto } from '../dtos/ebook.dto';
import { EbookService } from '../services/ebook.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlinkSync } from 'fs';
import { BaseController } from 'src/core/controllers/base.controller';
import { EbookStatusDTO } from '../dtos/ebook-status';
import { EbookEditorChoiceDTO } from '../dtos/ebook-editor-choice.dto';
import { EbookStatusApprovalDTO } from '../dtos/ebook-status-approval.dto';

@Controller({ path: 'api/ebook', version: '1' })
export class EbookController
    extends BaseController
    implements EbookControllerInterface {
    private logger = new Logger(EbookController.name);

    constructor(private readonly ebookService: EbookService) {
        super(EbookController.name);
    }

    @Get('search')
    async search(
        @Res() res: Response<Record<string, any>>,
        @Query('q') query: string,
    ): Promise<Response<Record<string, any>>> {
        try {
            const result = await this.ebookService.search(query);

            return res
                .status(200)
                .send(this.responseMessage('ebook', 'Search', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Get Ebook
    @Get()
    async getEbook(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search?: string,
        @Query('id_ebook_category') id_ebook_category?: number,
        @Query('personalNumber') personalNumber?: string,
        @Query('sortBy') sortBy?: string,
        @Query('status') status?: string,
        @Query('approval_status') approvalStatus?: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);

            let isActive = null;

            if (status) {
                isActive = this.validationBooleanParams(status);
            }

            const result = await this.ebookService.getEbook(
                page,
                limit,
                search,
                Number(id_ebook_category),
                personalNumber,
                sortBy,
                isActive,
                approvalStatus,
            );
            return res
                .status(200)
                .send(this.responseMessage('ebook', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Get Ebook By Id
    @Get('/:uuid')
    async getEbookById(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.ebookService.getEbookById(uuid);
            return res
                .status(200)
                .send(this.responseMessage('ebook', 'Get by Id', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Create Ebook
    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'file_ebook', maxCount: 1 },
                { name: 'ebook_cover', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: (req, file, cb) => {
                        let destination: any;
                        if (file.fieldname === 'file_ebook') {
                            destination = './uploads/ebook/file';
                        } else if (file.fieldname === 'ebook_cover') {
                            destination = './uploads/ebook/thumbnail';
                        }
                        cb(null, destination);
                    },
                    filename: (req, file, cb) => {
                        const randomNameFile =
                            Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const extensionFile = extname(file.originalname);
                        const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
                        cb(null, fileName);
                    },
                }),
            },
        ),
    )
    async createEbook(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: any,
        @UploadedFiles()
        files: {
            file_ebook: Express.Multer.File;
            ebook_cover: Express.Multer.File;
        },
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (files.ebook_cover && files.file_ebook) {
                this.validateImagePDF(
                    files.ebook_cover[0],
                    files.file_ebook[0],
                );
                await this.checkPoint(
                    'Create Ebook',
                    dto.personalNumber,
                    dto.status,
                );
                const data: EbookDTO = {
                    ebook_file: files.file_ebook[0].filename,
                    ebook_cover: files.ebook_cover[0].filename,
                    title: dto.title,
                    synopsis: dto.synopsis,
                    overview: dto.overview,
                    author: dto.author,
                    about_author: dto.about_author,
                    personalNumber: dto.personalNumber,
                    upload_by: dto.upload_by,
                    unit: dto.unit,
                    ebook_category: Number(dto.ebook_category),
                    path_cover: `ebook/thumbnail/${files.ebook_cover[0].filename}`,
                    path_ebook: `ebook/file/${files.file_ebook[0].filename}`,
                };

                await this.errorsValidation(
                    EbookDTO,
                    data,
                    files.ebook_cover[0],
                    files.file_ebook[0],
                );
                const result = await this.ebookService.createEbook(data);
                return res
                    .status(201)
                    .send(this.responseMessage('ebook', 'Create', 201, result));
            }
            if (!files.ebook_cover && !files.file_ebook) {
                throw new BadRequestException('File and Image is required!');
            }
            if (files.ebook_cover) {
                this.validateSingleImage(files.ebook_cover[0]);
                unlinkSync(files.ebook_cover[0].path);
                throw new BadRequestException('File Pdf is required!');
            }
            if (files.file_ebook) {
                this.validatePDF(files.file_ebook[0]);
                unlinkSync(files.file_ebook[0].path);
                throw new BadRequestException('Image is required!');
            }
        } catch (error) {
            throw error;
        }
    }

    //Update Ebook (General)
    @Put('/:uuid')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'file_ebook', maxCount: 1 },
                { name: 'ebook_cover', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: (req, file, cb) => {
                        let destination: any;
                        if (file.fieldname === 'file_ebook') {
                            destination = './uploads/ebook/file';
                        } else if (file.fieldname === 'ebook_cover') {
                            destination = './uploads/ebook/thumbnail';
                        }
                        cb(null, destination);
                    },
                    filename: (req, file, cb) => {
                        const randomNameFile =
                            Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const extensionFile = extname(file.originalname);
                        const fileName = `${randomNameFile}_${file.fieldname}${extensionFile}`;
                        cb(null, fileName);
                    },
                }),
            },
        ),
    )
    async updateEbook(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: any,
        @UploadedFiles()
        files: {
            file_ebook: Express.Multer.File;
            ebook_cover: Express.Multer.File;
        },
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            if (files.ebook_cover && files.file_ebook) {
                this.validateImagePDF(
                    files.ebook_cover[0],
                    files.file_ebook[0],
                );
                const data: EbookDTO = {
                    ebook_file: files.file_ebook[0].filename,
                    ebook_cover: files.ebook_cover[0].filename,
                    title: dto.title,
                    synopsis: dto.synopsis,
                    overview: dto.overview,
                    author: dto.author,
                    about_author: dto.about_author,
                    personalNumber: dto.personalNumber,
                    upload_by: dto.upload_by,
                    unit: dto.unit,
                    ebook_category: Number(dto.ebook_category),
                    path_cover: `ebook/thumbnail/${files.ebook_cover[0].filename}`,
                    path_ebook: `ebook/file/${files.file_ebook[0].filename}`,
                };
                await this.errorsValidation(
                    EbookDTO,
                    data,
                    files.ebook_cover[0],
                    files.file_ebook[0],
                );
                const result = await this.ebookService.updateEbook(uuid, data);
                return res
                    .status(200)
                    .send(this.responseMessage('ebook', 'Update', 200, result));
            }
            if (!files.ebook_cover && !files.file_ebook) {
                throw new BadRequestException('File and Image is required!');
            }
            if (files.ebook_cover) {
                this.validateSingleImage(files.ebook_cover[0]);
                unlinkSync(files.ebook_cover[0].path);
                throw new BadRequestException('File Pdf is required!');
            }
            if (files.file_ebook) {
                this.validatePDF(files.file_ebook[0]);
                unlinkSync(files.file_ebook[0].path);
                throw new BadRequestException('Image is required!');
            }
        } catch (error) {
            throw error;
        }
    }

    //Update Ebook Status Approval
    @Put('/status-approval/:uuid')
    async updateEbookStatusApproval(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: EbookStatusApprovalDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(EbookStatusApprovalDTO, dto);
            const result = await this.ebookService.updateEbookStatusApproval(
                uuid,
                dto,
            );

            await this.checkPoint(
                'Create Ebook',
                result.personalNumber,
                dto.approvalStatus === 'Approved' ? true : false,
            );

            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Ebook',
                        'Update Approval Status',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Update Ebook Status
    @Put('/status/:uuid')
    async updateEbookStatus(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: EbookStatusDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(EbookStatusDTO, dto);
            const result = await this.ebookService.updateEbookStatus(uuid, dto);
            return res
                .status(200)
                .send(
                    this.responseMessage('Ebook', 'Update Status', 200, result),
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
        @Body() dto: EbookEditorChoiceDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(EbookEditorChoiceDTO, dto);
            const result = await this.ebookService.updateEbookEditorChoice(
                uuid,
                dto,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Ebook',
                        'Update Editor Choice',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Delete Ebook
    @Delete('/:uuid')
    async deleteEbook(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const findData = await this.ebookService.getEbookById(uuid);
            unlinkSync(`./uploads/ebook/file/${findData.ebookFile}`);
            unlinkSync(`./uploads/ebook/thumbnail/${findData.ebookCover}`);
            const result = await this.ebookService.deleteEbook(uuid);
            return res
                .status(200)
                .send(this.responseMessage('ebook', 'Delete', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Update View Ebook
    @Put('/view/:uuid')
    async updateViewEbook(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.ebookService.updateViewEbook(uuid);
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Ebook',
                        'Update View Count',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    @Get('/export/*')
    async exportExcel(
        @Res() res: Response,
        @Query() queryParams: QueryParamsDto,
    ): Promise<Response<Buffer>> {
        try {
            const result = await this.ebookService.exportExcel(queryParams);

            return res
                .status(200)
                .set(
                    'Content-Disposition',
                    `attachment; filename=ebook-${new Date()}`,
                )
                .send(result);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
