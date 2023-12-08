import { Response } from 'express';
import { EbookCollectionReadDTO } from '../dtos/ebook-collection-read.dto';

export interface EbookCollectionReadControllerInterface {
  getEbookCollection(
    res: Response,
    page: number,
    limit: number,
    personalNumber?: string,
    search?: string,
  ): Promise<Response>;

  createEbookCollection(
    res: Response,
    dto: EbookCollectionReadDTO,
  ): Promise<Response>;

  checkEbookCollectionExist(
    res: Response,
    dto: EbookCollectionReadDTO,
  ): Promise<Response>;

  deleteEbookCollection(res: Response, uuid: string): Promise<Response>;

  getEbookRead(
    res: Response,
    page: number,
    limit: number,
    personalNumber?: string,
    search?: string,
  ): Promise<Response>;

  createEbookRead(
    res: Response,
    dto: EbookCollectionReadDTO,
  ): Promise<Response>;

  deleteEbookRead(res: Response, uuid: string): Promise<Response>;
}
