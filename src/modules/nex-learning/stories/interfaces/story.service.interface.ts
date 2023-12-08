import { StoryWatch } from '@prisma/clients/nex-learning';
import { Story } from '@prisma/clients/nex-learning';
import { StatisticStoryDTO, StoryDTO } from '../dtos/story.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { StoryStatusDTO, StoryStatusOnlyDTO } from '../dtos/story-status.dto';
import { StoryWatchDTO } from '../dtos/story-watch.dto';
export interface StoryServiceInterface {
  //User Method
  getStory(
    page: number,
    limit: number,
    search: string,
    category: string,
    sortBy: string,
    isAdmin?: string,
  ): Promise<ResponseDTO<Story[]>>;

  getStoryById(uuid: string): Promise<Story>;

  createStory(dto: StoryDTO): Promise<Story>;

  updateStory(uuid: string, dto: StoryDTO): Promise<Story>;

  deleteStory(uuid: string): Promise<Story>;

  approveReject(uuid: string, dto: StoryStatusDTO): Promise<Story>;

  editorChoice(uuid: string, dto: StoryStatusOnlyDTO): Promise<Story>;

  activeDeactive(uuid: string, dto: StoryStatusOnlyDTO): Promise<Story>;

  watchStory(
    uuid: string,
    personalNumber: string,
    storyId: number,
    dto: StoryWatchDTO,
  ): Promise<Story>;

  getStatisticStory(category: string): Promise<StatisticStoryDTO>;
}
