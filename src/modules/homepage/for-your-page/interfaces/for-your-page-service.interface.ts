import { ForYourPage } from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { ForYourPageDTO } from '../dto/for-your-page.dto';

export interface ForYourPageServiceInterface {
    getForYourPage(
        page: number,
        limit: number,
        personalNumber: string,
    ): Promise<ResponseDTO<ForYourPage[]>>;

    createForYourPage(dto: ForYourPageDTO): Promise<ForYourPage>;

    deleteForYourPage(uuid: string): Promise<ForYourPage>;
}
