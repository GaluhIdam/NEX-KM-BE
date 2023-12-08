import { EbookRead } from '@prisma/clients/nex-library';
import { EbookCollection } from '@prisma/clients/nex-library';
import { EbookCollectionReadDTO } from '../dtos/ebook-collection-read.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
export interface EbookCollectionReadServiceInterface {
  getEbookCollection(
    page: number,
    limit: number,
    personalNumber?: string,
    search?: string,
    sortBy?: string,
  ): Promise<PaginationDTO<EbookCollection[]>>;

  createEbookCollection(dto: EbookCollectionReadDTO): Promise<EbookCollection>;

  deleteEbookCollection(uuid: string): Promise<EbookCollection>;

  getEbookRead(
    page: number,
    limit: number,
    personalNumber?: string,
    search?: string,
    sortBy?: string,
  ): Promise<PaginationDTO<EbookRead[]>>;

  checkEbookCollectionExist(
    dto: EbookCollectionReadDTO,
  ): Promise<EbookCollection>;

  createEbookRead(dto: EbookCollectionReadDTO): Promise<EbookRead>;

  deleteEbookRead(uuid: string): Promise<EbookRead>;
}
