import { Response } from 'express';
import {
  BestPracticeApproveDTO,
  BestPracticeDTO,
  CommentLikeBestPracticeDTO,
} from '../dtos/best-practice.dto';
import { ArticleStatusDTO } from '../../articles/dtos/article-status.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { CommentBestPracticeDTO } from '../dtos/comment-best-practice.dto';

export interface BestPracticeControllerInterface {
  getBestPractice(
    res: Response,
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
  ): Promise<Response>;

  getBestPracticeById(res: Response, uuid: string): Promise<Response>;

  createBestPractice(
    res: Response,
    dto: BestPracticeDTO,
    image: Express.Multer.File,
  ): Promise<Response>;

  updateBestPractice(
    res: Response,
    uuid: string,
    dto: BestPracticeDTO,
    image: Express.Multer.File,
  ): Promise<Response>;

  deleteBestPractice(res: Response, uuid: string): Promise<Response>;

  approveReject(
    res: Response,
    uuid: string,
    dto: BestPracticeApproveDTO,
  ): Promise<Response>;

  editorChoice(
    res: Response,
    uuid: string,
    dto: ArticleStatusDTO,
  ): Promise<Response>;

  activeDeactive(
    res: Response,
    uuid: string,
    dto: ArticleStatusDTO,
  ): Promise<Response>;

  getComment(
    res: Response,
    practiceId: number,
    page: number,
    limit: number,
    sortBy: string,
  ): Promise<Response>;

  getReplyComment(
    res: Response,
    parentId: number,
    page: number,
    limit: number,
  ): Promise<Response>;

  createComment(res: Response, dto: CommentBestPracticeDTO): Promise<Response>;

  updateComment(
    res: Response,
    uuid: string,
    dto: CommentBestPracticeDTO,
  ): Promise<Response>;

  deleteComment(res: Response, uuid: string): Promise<Response>;

  likeDislikeComment(
    res: Response,
    bestPracticeId: number,
    commentBestPracticeId: number,
    personalNumber: string,
    dto: CommentLikeBestPracticeDTO,
  ): Promise<Response>;

  getStatisticBestPractice(res: Response): Promise<Response>;
}
