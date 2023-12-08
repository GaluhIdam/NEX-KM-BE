import { Communities } from '@prisma/clients/nex-community';
import { CommunityPublishDTO, FileImageDTO, PublishPrivateDTO } from '../dtos/community.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface CommunityServiceInterface {
  getCommunity(page: number, limit: number, search: string, sortBy: string, isAdmin: string): Promise<ResponseDTO<Communities[]>>;

  getCommunityById(uuid: string): Promise<Communities>

  createCommunity(dto: CommunityPublishDTO, image: FileImageDTO): Promise<Communities>;

  updateCommunity(uuid: string, dto: CommunityPublishDTO, image: FileImageDTO): Promise<Communities>;

  deleteCommunity(uuid: string): Promise<boolean>;

  publishPrivate(uuid: string, dto: PublishPrivateDTO): Promise<Communities>;

  banCommunity(uuid: string, dto: PublishPrivateDTO): Promise<Communities>;
}
