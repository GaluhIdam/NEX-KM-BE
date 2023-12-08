import { Response } from 'express';
import { StreamDTO } from '../dtos/stream.dto';
import { FavoriteDTO } from '../dtos/favorite.dto';
import { StreamStatusApprovalDTO } from '../dtos/stream-status.approval.dto';
import { StreamEditorChoiceDTO } from '../dtos/stream-editor-choice.dto';
import { StreamStatusDTO } from '../dtos/stream-status.dto';

export interface StreamControllerInterface {
  getStream(
    res: Response,
    page: number,
    limit: number,
    orderBy?: string,
    search?: string,
    editorChoice?: string,
    personalNumber?: string,
    status?: string,
    approvalStatus?: string,
  ): Promise<Response>;

  getStreamByUuid(res: Response, uuid: string): Promise<Response>;

  createStream(
    res: Response,
    dto: StreamDTO,
    files: {
      file: Express.Multer.File;
      thumbnail: Express.Multer.File;
    },
  ): Promise<Response>;

  updateStream(
    res: Response,
    uuid: string,
    dto: StreamDTO,
    files: {
      file: Express.Multer.File;
      thumbnail: Express.Multer.File;
    },
  ): Promise<Response>;

  deleteStream(res: Response, uuid: string): Promise<Response>;

  addFavorite(res: Response, dto: FavoriteDTO): Promise<Response>;

  deleteFavorite(res: Response, personalNumber: string): Promise<Response>;

  addWatch(res: Response, dto: FavoriteDTO): Promise<Response>;

  updateStreamStatusApproval(
    res: Response,
    uuid: string,
    dto: StreamStatusApprovalDTO,
  ): Promise<Response>;

  updateStreamEditorChoice(
    res: Response,
    uuid: string,
    dto: StreamEditorChoiceDTO,
  ): Promise<Response>;

  updateStreamStatus(
    res: Response,
    uuid: string,
    dto: StreamStatusDTO,
  ): Promise<Response>;
}
