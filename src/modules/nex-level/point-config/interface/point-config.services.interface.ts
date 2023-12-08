import { PointConfig } from '@prisma/clients/nex-level';
import { PointConfigDTO } from '../dtos/point-config.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface PointConfigServiceInterface {
  getPointConfig(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<PointConfig[]>>;

  getPointConfigByUUID(uuid: string): Promise<PointConfigDTO>;

  createPointConfig(dto: PointConfigDTO): Promise<PointConfigDTO>;

  updatePointConfigByUUID(
    uuid: string,
    dto: PointConfigDTO,
  ): Promise<PointConfigDTO>;

  deletePointConfigByUUID(uuid: string): Promise<PointConfigDTO>;
}
