import { Serie } from '@prisma/clients/nex-talk';
import { SerieDTO } from '../dtos/serie.dto';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';
import { SerieStatusApprovalDTO } from '../dtos/serie-status-approval.dto';
import { SerieEditorChoiceDTO } from '../dtos/serie-editor-choice.dto';
import { SerieStatusDTO } from '../dtos/serie-status.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';
export interface SerieServiceInterface {
  getSeries(
    page: number,
    limit: number,
    search?: string,
    order_by?: string,
    personal_number?: string,
    status?: boolean,
    creatorId?: number,
    approval_status?: string,
  ): Promise<PaginationDTO<Serie[]>>;

  getSerieByUuid(uuid: string): Promise<Serie>;

  createSeries(dto: SerieDTO): Promise<Serie>;

  updateSeries(uuid: string, dto: SerieDTO): Promise<Serie>;

  deleteSeries(uuid: string): Promise<Serie>;

  updateSerieStatusApproval(
    uuid: string,
    dto: SerieStatusApprovalDTO,
  ): Promise<Serie>;

  updateSerieEditorChoice(
    uuid: string,
    dto: SerieEditorChoiceDTO,
  ): Promise<Serie>;

  updateSerieStatus(uuid: string, dto: SerieStatusDTO): Promise<Serie>;

  getSerieStatistic(): Promise<StatisticDTO>;
}
