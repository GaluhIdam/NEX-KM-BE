import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface HomepageFuseServiceInterface {
    showResult(
        search: string,
        page: number,
        limit: number,
    ): Promise<ResponseDTO<any[]>>;
}
