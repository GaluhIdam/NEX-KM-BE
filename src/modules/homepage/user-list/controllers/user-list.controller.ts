import {
    BadRequestException,
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
import { UserListControllerInterface } from '../interfaces/user-list.controller.interface';
import { UserListService } from '../services/user-list.service';
import { Response } from 'express';
import {
    UserFollowerDTO,
    UserFollowingDTO,
    UserInfoDTO,
    UserInterestDTO,
    UserListDTO,
    UserSkillDTO,
    signAsDTO,
} from '../dtos/user-list.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller({ path: 'api/user-list', version: '1' })
export class UserListController
    extends BaseController
    implements UserListControllerInterface
{
    constructor(private readonly userlistService: UserListService) {
        super(UserListController.name);
    }

    @Put('update/:uuid')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/user/photo',
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
    async updateProfileUser(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: any,
        @UploadedFile() image: Express.Multer.File,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            this.validateSingleImage(image);
            const data: UserInfoDTO = {
                userPhoto: `user/photo/${dto.personalNumber}.jpeg`,
                username: dto.username,
                facebook: dto.facebook,
                instagram: dto.instagram,
                linkedIn: dto.linkedIn,
                personalNumber: dto.personalNumber,
                userInterest: dto.userInterest,
                userSkill: dto.userSkill,
            };
            await this.errorsValidation(UserInfoDTO, data);
            fs.unlinkSync(`./uploads/user/photo/${dto.personalNumber}.jpeg`);
            fs.renameSync(
                `./uploads/user/photo/${image.filename}`,
                `./uploads/user/photo/${dto.personalNumber}.jpeg`,
            );
            const result = await this.userlistService.updateProfileUser(
                uuid,
                dto,
            );
            return res
                .status(200)
                .send(this.responseMessage('user', 'Update', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Get('checker')
    async checker(
        @Res() res: Response<any, Record<string, any>>,
        @Query('follower') follower: string,
        @Query('following') following: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            if (!follower || !following) {
                throw new BadRequestException(
                    'follower & following is required!',
                );
            }
            const result = await this.userlistService.checkFollower(
                follower,
                following,
            );
            return res
                .status(200)
                .send(this.responseMessage('check', 'Follower', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Put('sign-as/:personalNumber')
    async signAs(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personalNumber') personalNumber: string,
        @Body() signAs: signAsDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.userlistService.setSignAs(
                personalNumber,
                signAs,
            );
            return res
                .status(200)
                .send(this.responseMessage('sign as', 'Sign in', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Get('following')
    async getFollowing(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            if (!personalNumber) {
                throw new BadRequestException('personalNumber is required!');
            }
            const result = await this.userlistService.getFollowing(
                page,
                limit,
                personalNumber,
            );
            return res
                .status(200)
                .send(this.responseMessage('Follower', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    @Get('follower')
    async getFollower(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            if (!personalNumber) {
                throw new BadRequestException('personalNumber is required!');
            }
            const result = await this.userlistService.getFollower(
                page,
                limit,
                personalNumber,
            );
            return res
                .status(200)
                .send(this.responseMessage('Follower', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Create Follower
    @Post('/follower-following')
    async createFollowingFollower(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: UserFollowerDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const follower = await this.userlistService.createFollowingFollower(
                dto,
            );
            return res.status(201).send(
                this.responseMessage('user list', 'Followed', 201, {
                    follower,
                }),
            );
        } catch (error) {
            throw error;
        }
    }

    // Delete Follower
    @Delete('/follower-following/:uuid')
    async deleteFollowingFollower(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.userlistService.deleteFollowingFollower(
                uuid,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'user list',
                        'Unfollowed',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Get User By Personal Number
    @Get(':personalNumber')
    async getUserListByPersonalNumber(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result =
                await this.userlistService.getUserListByPersonalNumber(
                    personalNumber,
                );
            return res
                .status(200)
                .send(this.responseMessage('user list', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Get User List
    @Get()
    async getUserList(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('sortBy') sortBy: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit);
            const result = await this.userlistService.getUserList(
                page,
                limit,
                search,
                sortBy,
            );
            return res
                .status(200)
                .send(this.responseMessage('user list', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Create User List
    @Post()
    @UseInterceptors(
        FileInterceptor('userPhoto', {
            storage: diskStorage({
                destination: './uploads/user/photo',
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
    async createUserList(
        @Res() res: Response<any, Record<string, any>>,
        @UploadedFile() userPhoto: Express.Multer.File,
        @Body() dto: any,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validateSingleImage(userPhoto);
            fs.renameSync(
                `./uploads/user/photo/${userPhoto.filename}`,
                `./uploads/user/photo/${dto.personalNumber}.jpeg`,
            );
            const data: UserListDTO = {
                userName: dto.userName,
                userPhoto: `user/photo/${dto.personalNumber}.jpeg`,
                personalNumber: dto.personalNumber,
                personalName: dto.personalName,
                personalUnit: dto.personalUnit,
                personalBirthPlace: dto.personalBirthPlace,
                personalEmail: dto.personalEmail,
                personalImage: dto.personalImage,
                personalTitle: dto.personalTitle,
                personalBirthDate: dto.personalBirthDate,
                personalGrade: dto.personalGrade,
                personalJobDesc: dto.personalJobDesc,
                instagram: dto.instagram,
                linkedIn: dto.linkedIn,
                facebook: dto.facebook,
                token: dto.token,
            };

            await this.errorsValidation(UserListDTO, data, userPhoto);
            const result = await this.userlistService.createUserList(data);
            return res
                .status(201)
                .send(this.responseMessage('user list', 'Create', 201, result));
        } catch (error) {
            throw error;
        }
    }

    //Update User List
    @Put(':personalNumber')
    @UseInterceptors(
        FileInterceptor('userPhoto', {
            storage: diskStorage({
                destination: './uploads/user/photo',
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
    async updateUserList(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personalNumber') personalNumber: string,
        @Body() dto: any,
        @UploadedFile() userPhoto: Express.Multer.File,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validateSingleImage(userPhoto);
            fs.renameSync(
                `./uploads/user/photo/${userPhoto.filename}`,
                `./uploads/user/photo/${dto.personalNumber}.jpeg`,
            );
            const data: UserListDTO = {
                userName: dto.userName,
                userPhoto: `user/photo/${dto.personalNumber}.jpeg`,
                personalNumber: personalNumber,
                personalName: dto.personalName,
                personalUnit: dto.personalUnit,
                personalBirthPlace: dto.personalBirthPlace,
                personalEmail: dto.personalEmail,
                personalImage: dto.personalImage,
                personalTitle: dto.personalTitle,
                personalBirthDate: dto.personalBirthDate,
                personalGrade: dto.personalGrade,
                personalJobDesc: dto.personalJobDesc,
                instagram: dto.instagram,
                linkedIn: dto.linkedIn,
                facebook: dto.facebook,
                token: dto.token,
            };

            await this.errorsValidation(UserListDTO, data, userPhoto);

            const result = await this.userlistService.updateUserList(
                personalNumber,
                data,
            );
            return res
                .status(200)
                .send(this.responseMessage('user list', 'Update', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Delete User List
    @Delete(':uuid')
    async deleteUserList(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.userlistService.deleteUserList(uuid);
            return res
                .status(200)
                .send(this.responseMessage('user list', 'Delete', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Get User Skill
    @Get('user-skill/:personalNumber')
    async getUserSkill(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.userlistService.getUserSkill(
                personalNumber,
            );
            return res
                .status(200)
                .send(this.responseMessage('user skill', 'Get', 200, result));
        } catch (error) {
            throw error;
        }
    }

    //Create User Skill
    @Post('user-skill')
    async createUserSkill(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: UserSkillDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.userlistService.createUserSkill(dto);
            return res
                .status(201)
                .send(
                    this.responseMessage('user skill', 'Create', 201, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Update User Skill
    @Put('user-skill/:uuid')
    async updateUserSkill(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: UserSkillDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.userlistService.updateUserSkill(
                uuid,
                dto,
            );
            return res
                .status(201)
                .send(
                    this.responseMessage('user skill', 'Update', 201, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Delete User Skill
    @Delete('user-skill/:uuid')
    async deleteUserSkill(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.userlistService.deleteUserSkill(uuid);
            return res
                .status(201)
                .send(
                    this.responseMessage('user skill', 'Delete', 201, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Get User Interest
    @Get('user-interest/:personalNumber')
    async getUserInterest(
        @Res() res: Response<any, Record<string, any>>,
        @Param('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.userlistService.getUserInterest(
                personalNumber,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage('user interest', 'Get', 200, result),
                );
        } catch (error) {
            throw error;
        }
    }

    //Create User Interest
    @Post('user-interest')
    async createUserInterest(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: UserInterestDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.userlistService.createUserInterest(dto);
            return res
                .status(201)
                .send(
                    this.responseMessage(
                        'user interest',
                        'Create',
                        201,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Update User Interest
    @Put('user-interest/:uuid')
    async updateUserInterest(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: UserInterestDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.userlistService.updateUserInterest(
                uuid,
                dto,
            );
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'user interest',
                        'Update',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }

    //Delete User Interest
    @Delete('user-interest/:uuid')
    async deleteUserInterest(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.userlistService.deleteUserInterest(uuid);
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'user interest',
                        'Delete',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }
}
