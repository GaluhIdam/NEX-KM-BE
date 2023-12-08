import { Response } from 'express';
import { ForumStatusApprovalDTO } from '../dtos/forum-status-approval.dto';
import { ForumEditorChoiceDTO } from '../dtos/forum-editor-choice.dto';

export interface ForumControllerInterface {
    getForum(
        res: Response,
        page: number,
        limit: number,
        id_forum_category?: number,
        search?: string,
        order_by?: string,
        status?: string,
        approval_status?: string,
    ): Promise<Response>;

    getForumById(res: Response, uuid: string): Promise<Response>;

    createForum(
        res: Response,
        dto: any,
        media?: Express.Multer.File,
    ): Promise<Response>;

    updateForum(
        res: Response,
        uuid: string,
        dto: any,
        media?: Express.Multer.File,
    ): Promise<Response>;

    deleteForum(res: Response, uuid: string): Promise<Response>;

    updateForumStatusApproval(
        res: Response,
        uuid: string,
        dto: ForumStatusApprovalDTO,
    ): Promise<Response>;

    updateEbookEditorChoice(
        res: Response,
        uuid: string,
        dto: ForumEditorChoiceDTO,
    ): Promise<Response>;

    getForumStatistic(res: Response): Promise<Response>;
}
