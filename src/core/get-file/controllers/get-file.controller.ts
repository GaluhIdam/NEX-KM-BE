import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { GetFileControllerInterface } from '../interfaces/get-file.controller.interface';
import { Response } from 'express';

@Controller({ path: 'api/file-manager', version: '1' })
export class GetFileController implements GetFileControllerInterface {
    //Get PDF or Image
    @Get('/get-imagepdf/:module/:sub_module/:name')
    async getFile(
        @Res() res: Response,
        @Param('module') module: string,
        @Param('sub_module') sub_module: string,
        @Param('name') name: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const sanitizedModule = module.replace(/\.\.|\./g, '');
            const sanitizedSubModule = sub_module.replace(/\.\.|\./g, '');
            const path = `uploads/${sanitizedModule}/${sanitizedSubModule}/${name}`;
            res.sendFile(path, { root: '.' });
            return res;
        } catch (error) {
            throw new NotFoundException('Your file not found!');
        }
    }

    @Get('/get-m3u8/:module/:folder/:name')
    async getFileM3U8WithModuleOnly(
        @Res() res: Response,
        @Param('module') module: string,
        @Param('folder') folder: string,
        @Param('name') name: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const path = `uploads/${module}/${folder}/${name}`;
            res.sendFile(path, { root: '.' });
            return res;
        } catch (error) {
            throw new NotFoundException('Your file not found!');
        }
    }

    @Get('/get-m3u8/:module/:sub_module/:folder/:name')
    async getFileM3U8WithSubModule(
        @Res() res: Response,
        @Param('module') module: string,
        @Param('sub_module') sub_module: string,
        @Param('folder') folder: string,
        @Param('name') name: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const path = `uploads/${module}/${sub_module}/${folder}/${name}`;
            res.sendFile(path, { root: '.' });
            return res;
        } catch (error) {
            throw new NotFoundException('Your file not found!');
        }
    }

    @Get('/avatar/:personalNumber')
    async getAvatarUser(
        @Res() res: Response,
        @Param('personalNumber') personalNumber: string,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const path = `uploads/user/photo/${personalNumber}.jpeg`;
            res.sendFile(path, { root: '.' });
            return res;
        } catch (error) {
            throw new NotFoundException('Your file not found!');
        }
    }
}
