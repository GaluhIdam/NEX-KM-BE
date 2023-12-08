import { Response } from 'express';
import { CommunityPublishDTO, FileImageDTO, PublishPrivateDTO } from '../dtos/community.dto';

export interface CommunityControllerInterface {

  getCommunity(res: Response, page: number, limit: number, search: string, sortBy: string, isAdmin: string): Promise<Response>;

  getCommunityById(res: Response, uuid: string): Promise<Response>;

  createCommunity(res: Response, data: CommunityPublishDTO, image: FileImageDTO): Promise<Response>;

  updateCommunity(res: Response, uuid: string, data: CommunityPublishDTO, image: FileImageDTO): Promise<Response>;

  deleteCommunity(res: Response, uuid: string): Promise<Response>;

  publishPrivate(res: Response, uuid: string, dto: PublishPrivateDTO): Promise<Response>;

  banCommunity(res: Response, uuid: string, dto: PublishPrivateDTO): Promise<Response>;
}
