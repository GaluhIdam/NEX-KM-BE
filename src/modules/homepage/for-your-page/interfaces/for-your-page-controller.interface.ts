import { ForYourPageDTO } from '../dto/for-your-page.dto';
import { Response } from 'express';

export interface ForYourPageControllerInterface {
    getForYourPage(
        res: Response,
        page: number,
        limit: number,
        personalNumber: string,
    ): Promise<Response>;
}
