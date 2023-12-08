import { Response } from 'express';
import { CreatorStatusApprovalDTO } from '../dtos/creator-status-approval.dto';
import { CreatorEditorChoiceDTO } from '../dtos/creator-editor-choice.dto';
import { CreatorStatusDTO } from '../dtos/creator-status.dto';

export interface CreatorControllerInterface {
  getCreators(
    res: Response,
    page: number,
    limit: number,
    search?: string,
    order_by?: string,
    personal_number?: string,
    approval_status?: string,
    status?: string,
  ): Promise<Response>;

  getCreatorByUuid(res: Response, uuid: string): Promise<Response>;

  createCreator(
    res: Response,
    dto: any,
    image: Express.Multer.File,
  ): Promise<Response>;

  updateCreator(
    res: Response,
    uuid: string,
    dto: any,
    image: Express.Multer.File,
  ): Promise<Response>;

  deleteCreator(res: Response, uuid: string): Promise<Response>;

  updateCreatorStatusApproval(
    res: Response,
    uuid: string,
    dto: CreatorStatusApprovalDTO,
  ): Promise<Response>;

  updateCreatorEditorChoice(
    res: Response,
    uuid: string,
    dto: CreatorEditorChoiceDTO,
  ): Promise<Response>;

  updateCreatorStatus(
    res: Response,
    uuid: string,
    dto: CreatorStatusDTO,
  ): Promise<Response>;

  getCreatorStatistic(res: Response): Promise<Response>;
}
