import { Response } from 'express';

export interface GetFileControllerInterface {
    getFile(res: Response, modulex: string, sub_module: string, name: string): Promise<Response>;
}