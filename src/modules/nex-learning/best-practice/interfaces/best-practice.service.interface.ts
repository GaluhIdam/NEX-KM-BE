import {
  BestPractice,
  CommentBestPractice,
  CommentLikeBestPractice,
} from '@prisma/clients/nex-learning';
import {
  BestPracticeApproveDTO,
  BestPracticeDTO,
  BestPracticeUpdateDTO,
  CommentLikeBestPracticeDTO,
  StatisticBestPracticeDTO,
} from '../dtos/best-practice.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { ArticleStatusDTO } from '../../articles/dtos/article-status.dto';
import { CommentBestPracticeDTO } from '../dtos/comment-best-practice.dto';
export interface BestParcticeServiceInterface {
  getBestPractice(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
  ): Promise<ResponseDTO<BestPractice[]>>;

  getBestPracticeById(uuid: string): Promise<BestPractice>;

  createBestPractice(dto: BestPracticeDTO): Promise<BestPractice>;

  updateBestPractice(
    uuid: string,
    dto: BestPracticeUpdateDTO,
  ): Promise<BestPractice>;

  deleteBestPractice(uuid: string): Promise<BestPractice>;

  approveReject(
    uuid: string,
    dto: BestPracticeApproveDTO,
  ): Promise<BestPractice>;

  editorChoice(uuid: string, dto: ArticleStatusDTO): Promise<BestPractice>;

  activeDeactive(uuid: string, dto: ArticleStatusDTO): Promise<BestPractice>;

  getComment(
    practiceId: number,
    page: number,
    limit: number,
    sortBy: string,
  ): Promise<ResponseDTO<CommentBestPractice[]>>;

  getReplyComment(
    parentId: number,
    page: number,
    limit: number,
  ): Promise<ResponseDTO<CommentBestPractice[]>>;

  createComment(dto: CommentBestPracticeDTO): Promise<CommentBestPractice>;

  updateComment(
    uuid: string,
    dto: CommentBestPracticeDTO,
  ): Promise<CommentBestPractice>;

  deleteComment(uuid: string): Promise<CommentBestPractice>;

  likeDislikeComment(
    bestPracticeId: number,
    commentBestPracticeId: number,
    personalNumber: string,
    dto: CommentLikeBestPracticeDTO,
  ): Promise<CommentLikeBestPractice>;

  getStatisticBestPractice(): Promise<StatisticBestPracticeDTO>;
}
