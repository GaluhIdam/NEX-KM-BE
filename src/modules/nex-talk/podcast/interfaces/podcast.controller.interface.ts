import { Response } from 'express';
import { PodcastStatusApprovalDTO } from '../dtos/podcast-status-approval.dto';
import { PodcastEditorChoiceDTO } from '../dtos/podcast-editor-choice.dto';
import { PodcastStatusDTO } from '../dtos/podcast-status.dto';

export interface PodcastControllerInterface {
    getPodcast(
        res: Response,
        page: number,
        limit: number,
        search?: string,
        orderBy?: string,
        personalNumber?: string,
        serieId?: string,
        status?: string,
        approvalStatus?: string,
    ): Promise<Response>;

    getPodcastById(res: Response, uuid: string): Promise<Response>;

    createPodcast(
        res: Response,
        dto: any,
        files: {
            file_podcast: Express.Multer.File;
            cover_podcast: Express.Multer.File;
        },
    ): Promise<Response>;

    updatePodcast(
        res: Response,
        uuid: string,
        dto: any,
        files: {
            file_podcast: Express.Multer.File;
            cover_podcast: Express.Multer.File;
        },
    ): Promise<Response>;

    deletePodcast(res: Response, uuid: string): Promise<Response>;

    updatePodcastStatusApproval(
        res: Response,
        uuid: string,
        dto: PodcastStatusApprovalDTO,
    ): Promise<Response>;

    updatePodcastEditorChoice(
        res: Response,
        uuid: string,
        dto: PodcastEditorChoiceDTO,
    ): Promise<Response>;

    updatePodcastStatus(
        res: Response,
        uuid: string,
        dto: PodcastStatusDTO,
    ): Promise<Response>;

    getPodcastStatistic(res: Response): Promise<Response>;

    playPodcast(res: Response, uuid: string): Promise<Response>;
}
