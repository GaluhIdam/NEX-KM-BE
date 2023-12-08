import { Response } from 'express';
import { QueryParams } from '../dtos/feeds.dto';

export interface FeedControllerInterface {
    getFeeds(
        res: Response,
        personnelNumber: string,
        queryParams: QueryParams,
    ): Promise<Response>;
}
