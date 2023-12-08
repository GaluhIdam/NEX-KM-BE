import { Response } from 'express';
import { SerieStatusApprovalDTO } from '../dtos/serie-status-approval.dto';
import { SerieEditorChoiceDTO } from '../dtos/serie-editor-choice.dto';
import { SerieStatusDTO } from '../dtos/serie-status.dto';

export interface SerieControllerInterface {
  getSeries(
    res: Response,
    page: number,
    limit: number,
    search?: string,
    order_by?: string,
    personal_number?: string,
    status?: string,
    creator_id?: string,
    approval_status?: string,
  ): Promise<Response>;

  getSerieByUuid(res: Response, uuid: string): Promise<Response>;

  createSeries(
    res: Response,
    dto: any,
    image: Express.Multer.File,
  ): Promise<Response>;

  updateSeries(
    res: Response,
    uuid: string,
    dto: any,
    image: Express.Multer.File,
  ): Promise<Response>;

  deleteSeries(res: Response, uuid: string): Promise<Response>;

  updateSerieStatusApproval(
    res: Response,
    uuid: string,
    dto: SerieStatusApprovalDTO,
  ): Promise<Response>;

  updateSerieEditorChoice(
    res: Response,
    uuid: string,
    dto: SerieEditorChoiceDTO,
  ): Promise<Response>;

  updateSerieStatus(
    res: Response,
    uuid: string,
    dto: SerieStatusDTO,
  ): Promise<Response>;

  getSerieStatistic(res: Response): Promise<Response>;
}
