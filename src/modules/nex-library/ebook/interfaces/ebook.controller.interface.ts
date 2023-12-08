import { Response } from 'express';
import { EbookDTO } from '../dtos/ebook.dto';
import { EbookStatusDTO } from '../dtos/ebook-status';
import { EbookEditorChoiceDTO } from '../dtos/ebook-editor-choice.dto';
import { EbookStatusApprovalDTO } from '../dtos/ebook-status-approval.dto';

export interface EbookControllerInterface {
  getEbook(
    res: Response,
    page: number,
    limit: number,
    search?: string,
    id_ebook_category?: number,
    personalNumber?: string,
    sortBy?: string,
    status?: string,
    approvalStatus?: string,
  ): Promise<Response>;

  getEbookById(res: Response, uuid: string): Promise<Response>;

  createEbook(
    res: Response,
    dto: EbookDTO,
    files: {
      file_ebook: Express.Multer.File;
      ebook_cover: Express.Multer.File;
    },
  ): Promise<Response>;

  updateEbook(
    res: Response,
    uuid: string,
    dto: EbookDTO,
    files: {
      file_ebook: Express.Multer.File;
      ebook_cover: Express.Multer.File;
    },
  ): Promise<Response>;

  updateEbookStatusApproval(
    res: Response,
    uuid: string,
    dto: EbookStatusApprovalDTO,
  ): Promise<Response>;

  updateEbookStatus(
    res: Response,
    uuid: string,
    dto: EbookStatusDTO,
  ): Promise<Response>;

  updateEbookEditorChoice(
    res: Response,
    uuid: string,
    dto: EbookEditorChoiceDTO,
  ): Promise<Response>;

  deleteEbook(res: Response, uuid: string): Promise<Response>;

  updateViewEbook(res: Response, uuid: string): Promise<Response>;
}
