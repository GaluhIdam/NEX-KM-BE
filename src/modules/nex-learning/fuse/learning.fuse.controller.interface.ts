import { Response } from 'express';

export interface LearningFuseControllerInterface {
    getSuggestion(res: Response, search: string): Promise<Response>;

    showTrendingSearch(res: Response): Promise<Response>;

    showResult(res: Response, search: string, page: number, limit: number): Promise<Response>;

    showResultByInterest(res: Response, search: string[]): Promise<Response>;
}
