import { Ebook } from '@prisma/clients/nex-library';
import { EbookDTO } from '../dtos/ebook.dto';
import { EbookStatusDTO } from '../dtos/ebook-status';
import { EbookEditorChoiceDTO } from '../dtos/ebook-editor-choice.dto';
import { EbookStatusApprovalDTO } from '../dtos/ebook-status-approval.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';

export interface EbookServiceInterface {
  getEbook(
    page: number,
    limit: number,
    search?: string,
    id_ebook_category?: number,
    personalNumber?: string,
    sortBy?: string,
    status?: boolean,
    approvalStatus?: string,
  ): Promise<PaginationDTO<Ebook[]>>;

  getEbookById(uuid: string): Promise<Ebook>;

  createEbook(dto: EbookDTO): Promise<Ebook>;

  updateEbook(uuid: string, dto: EbookDTO): Promise<Ebook>;

  updateEbookStatusApproval(
    uuid: string,
    dto: EbookStatusApprovalDTO,
  ): Promise<Ebook>;

  updateEbookStatus(uuid: string, dto: EbookStatusDTO): Promise<Ebook>;

  updateEbookEditorChoice(
    uuid: string,
    dto: EbookEditorChoiceDTO,
  ): Promise<Ebook>;

  deleteEbook(uuid: string): Promise<Ebook>;

  updateViewEbook(uuid: string): Promise<Ebook>;
}
