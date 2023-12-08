import { Stream, WatchStream, FavoriteStream } from '@prisma/clients/nex-talk';
import { StreamDTO } from '../dtos/stream.dto';
import { FavoriteDTO } from '../dtos/favorite.dto';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';
import { StreamStatusApprovalDTO } from '../dtos/stream-status.approval.dto';
import { StreamEditorChoiceDTO } from '../dtos/stream-editor-choice.dto';
import { StreamStatusDTO } from '../dtos/stream-status.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';

export interface StreamServiceInterface {
  getStream(
    page: number,
    limit: number,
    orderBy?: string,
    search?: string,
    editorChoice?: boolean,
    personalNumber?: string,
    status?: boolean,
    approvalStatus?: string,
  ): Promise<PaginationDTO<Stream[]>>;

  getStreamByUuid(uuid: string): Promise<Stream>;

  createStream(dto: StreamDTO): Promise<Stream>;

  updateStream(uuid: string, dto: StreamDTO): Promise<Stream>;

  deleteStream(uuid: string): Promise<Stream>;

  addFavorite(dto: FavoriteDTO): Promise<FavoriteStream>;

  deleteFavorite(personalNumber: string): Promise<FavoriteStream>;

  addWatchStream(dto: FavoriteDTO): Promise<WatchStream>;

  updateStreamStatusApproval(
    uuid: string,
    dto: StreamStatusApprovalDTO,
  ): Promise<Stream>;

  updateStreamEditorChoice(
    uuid: string,
    dto: StreamEditorChoiceDTO,
  ): Promise<Stream>;

  updateStreamStatus(uuid: string, dto: StreamStatusDTO): Promise<Stream>;

  getStreamStatistic(): Promise<StatisticDTO>;
}
