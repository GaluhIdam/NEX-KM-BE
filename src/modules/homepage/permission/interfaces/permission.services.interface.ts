import { MasterPermission } from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface PermissionServiceInterface {
  getPermission(
    page: number,
    limit: number,
    search: string,
  ): Promise<ResponseDTO<MasterPermission[]>>;
}
