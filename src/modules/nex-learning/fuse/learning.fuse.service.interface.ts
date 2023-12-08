import { LearningFuseSearch } from '@prisma/clients/nex-learning';
import { MergeLearningDTO } from './fuse.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
export interface LearningFuseServiceInterface {
    getSuggestion(search: string): Promise<LearningFuseSearch[]>;

    createCheck(search: string): Promise<LearningFuseSearch>;

    saveSearch(search: string): Promise<LearningFuseSearch>;

    showTrendingSearch(): Promise<LearningFuseSearch[]>;

    showResultSearch(
        search: string,
        page: number,
        limit: number,
    ): Promise<ResponseDTO<any[]>>;

    showResultSearchByInterest(search: string[]): Promise<MergeLearningDTO[]>;
}
