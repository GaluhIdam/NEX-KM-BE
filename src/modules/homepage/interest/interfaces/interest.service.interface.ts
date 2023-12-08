import { Interest } from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { InterestDTO } from '../dtos/interest.dto';
export interface InterestServiceInterface {
  getInterest(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Interest[]>>;

  getInterestByUuid(uuid: string): Promise<Interest>;

  createInterest(dto: InterestDTO): Promise<Interest>;

  updateInterest(uuid: string, dto: InterestDTO): Promise<Interest>;

  deleteInterest(uuid: string): Promise<Interest>;
}
