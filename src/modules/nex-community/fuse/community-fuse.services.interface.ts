import { CommunityFuseSearch } from '@prisma/clients/nex-community';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { MergeCommunityDTO } from './community-fuse.dto';
export interface CommunityFuseServiceInterface {
    getSuggestion(search: string): Promise<CommunityFuseSearch[]>;

    createCheck(search: string): Promise<CommunityFuseSearch>;

    saveSearch(search: string): Promise<CommunityFuseSearch>;

    showTrendingSearch(): Promise<CommunityFuseSearch[]>;

    showResultSearch(
        search: string,
        page: number,
        limit: number,
    ): Promise<ResponseDTO<any[]>>;

    showResultSearchByInterest(search: string[]): Promise<MergeCommunityDTO[]>;
}
