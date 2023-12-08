import { Miles } from '@prisma/clients/nex-level';
import { MilesDTO } from '../dtos/miles.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface MilesServiceInterface {
  getAllMiles(): Promise<ResponseDTO<Miles[]>>;

  getMiles(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Miles[]>>;

  getMilesByUuid(uuid: string): Promise<MilesDTO>;

  createMiles(dto: MilesDTO): Promise<MilesDTO>;

  updateMilesByUUID(uuid: string, dto: MilesDTO): Promise<MilesDTO>;

  deleteMilesByUUID(uuid: string): Promise<MilesDTO>;
}
