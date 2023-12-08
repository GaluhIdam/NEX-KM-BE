import { Podcast } from '@prisma/clients/nex-talk';
import { PodcastDTO } from '../dtos/podcast.dto';
import { PaginationDTO } from '../../../../core/dtos/pagination.dto';
import { PodcastStatusApprovalDTO } from '../dtos/podcast-status-approval.dto';
import { PodcastEditorChoiceDTO } from '../dtos/podcast-editor-choice.dto';
import { PodcastStatusDTO } from '../dtos/podcast-status.dto';
import { StatisticDTO } from 'src/core/dtos/statistic.dto';
export interface PodcastServiceInterface {
    getPodcast(
        page: number,
        limit: number,
        search?: string,
        orderBy?: string,
        personalNumber?: string,
        serieId?: number,
        status?: boolean,
        approvalStatus?: string,
    ): Promise<PaginationDTO<Podcast[]>>;

    getPodcastById(uuid: string): Promise<Podcast>;

    createPodcast(dto: PodcastDTO): Promise<Podcast>;

    updatePodcast(uuid: string, dto: PodcastDTO): Promise<Podcast>;

    deletePodcast(uuid: string): Promise<Podcast>;

    updatePodcastStatusApproval(
        uuid: string,
        dto: PodcastStatusApprovalDTO,
    ): Promise<Podcast>;

    updatePodcastEditorChoice(
        uuid: string,
        dto: PodcastEditorChoiceDTO,
    ): Promise<Podcast>;

    updatePodcastStatus(uuid: string, dto: PodcastStatusDTO): Promise<Podcast>;

    getPodcastStatistic(): Promise<StatisticDTO>;

    playPodcast(uuid: string): Promise<Podcast>;
}
