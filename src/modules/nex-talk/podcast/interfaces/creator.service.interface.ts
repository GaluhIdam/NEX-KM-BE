import { CreatorDTO } from './../dtos/creator.dto';
import { Creator } from '@prisma/clients/nex-talk';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';
import { CreatorStatusApprovalDTO } from '../dtos/creator-status-approval.dto';
import { CreatorEditorChoiceDTO } from '../dtos/creator-editor-choice.dto';
import { CreatorStatusDTO } from '../dtos/creator-status.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';

export interface CreatorServiceInterface {
  getCreators(
    page: number,
    limit: number,
    search?: string,
    order_by?: string,
    personal_number?: string,
    approval_status?: string,
    status?: boolean,
  ): Promise<PaginationDTO<Creator[]>>;

  getCreatorByUuid(uuid: string): Promise<Creator>;

  createCreator(dto: CreatorDTO): Promise<Creator>;

  updateCreator(uuid: string, dto: CreatorDTO): Promise<Creator>;

  deleteCreator(uuid: string): Promise<Creator>;

  updateCreatorStatusApproval(
    uuid: string,
    dto: CreatorStatusApprovalDTO,
  ): Promise<Creator>;

  updateCreatorEditorChoice(
    uuid: string,
    dto: CreatorEditorChoiceDTO,
  ): Promise<Creator>;

  updateCreatorStatus(uuid: string, dto: CreatorStatusDTO): Promise<Creator>;

  getCreatorStatistic(): Promise<StatisticDTO>;
}
