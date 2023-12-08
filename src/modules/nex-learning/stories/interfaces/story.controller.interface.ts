import { Response } from 'express';
import { StoryDTO } from '../dtos/story.dto';
import { Observable } from 'rxjs';
import { StoryStatusDTO, StoryStatusOnlyDTO } from '../dtos/story-status.dto';
import { StoryWatchDTO } from '../dtos/story-watch.dto';

export interface StoryControllerInterface {
  //User Method
  getStory(
    res: Response,
    page: number,
    limit: number,
    search: string,
    category: string,
    sortBy: string,
    isAdmin?: string,
  ): Promise<Response>;

  getStoryById(res: Response, uuid: string): Promise<Response>;

  createStory(
    res: Response,
    dto: any,
    files: {
      video: Express.Multer.File;
      cover: Express.Multer.File;
    },
  ): Promise<Response>;

  updateStory(
    res: Response,
    uuid: string,
    dto: StoryDTO,
    files: {
      video: Express.Multer.File;
      cover: Express.Multer.File;
    },
  ): Promise<Response>;

  deleteStory(res: Response, uuid: string): Promise<Response>;

  approveReject(
    res: Response,
    uuid: string,
    dto: StoryStatusDTO,
  ): Promise<Response>;

  editorChoice(
    res: Response,
    uuid: string,
    dto: StoryStatusOnlyDTO,
  ): Promise<Response>;

  activeDeactive(
    res: Response,
    uuid: string,
    dto: StoryStatusOnlyDTO,
  ): Promise<Response>;

  watchStory(
    res: Response,
    uuid: string,
    personalNumber: string,
    storyId: number,
    dto: StoryWatchDTO,
  ): Promise<Response>;

  getStatisticStory(res: Response, category: string): Promise<Response>;
}
