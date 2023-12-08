import { Response } from 'express';

export interface PermissionControllerInterface {
  getPermission(
    res: Response,
    page: number,
    limit: number,
    search: string,
  ): Promise<Response>;
}
