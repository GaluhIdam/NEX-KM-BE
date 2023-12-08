import { Response } from 'express';

export interface CommunityFuseControllerInterface {
    getSuggestion(res: Response, search: string): Promise<Response>;

    showTrendingSearch(res: Response): Promise<Response>;

    showResult(res: Response, search: string, limit: number): Promise<Response>;

    showResultByInterest(res: Response, search: string[]): Promise<Response>;
}
