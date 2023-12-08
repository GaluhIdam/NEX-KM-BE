import { Forum } from '@prisma/clients/nex-talk';
import { ForumDTO } from '../dtos/forum.dto';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';
import { ForumStatusApprovalDTO } from '../dtos/forum-status-approval.dto';
import { ForumEditorChoiceDTO } from '../dtos/forum-editor-choice.dto';
import { ForumStatusDTO } from '../dtos/forum-status.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';
export interface ForumServiceInterface {
    getForum(
        page: number,
        limit: number,
        id_forum_category?: number,
        search?: string,
        order_by?: string,
        status?: boolean,
        approval_status?: string,
    ): Promise<PaginationDTO<Forum[]>>;

    getForumById(uuid: string): Promise<Forum>;

    createForum(dto: ForumDTO): Promise<Forum>;

    updateForum(uuid: string, dto: ForumDTO): Promise<Forum>;

    deleteForum(uuid: string): Promise<Forum>;

    updateForumStatusApproval(
        uuid: string,
        dto: ForumStatusApprovalDTO,
    ): Promise<Forum>;

    updateForumEditorChoice(
        uuid: string,
        dto: ForumEditorChoiceDTO,
    ): Promise<Forum>;

    updateForumStatus(uuid: string, dto: ForumStatusDTO): Promise<Forum>;

    getForumStatistic(): Promise<StatisticDTO>;
}
