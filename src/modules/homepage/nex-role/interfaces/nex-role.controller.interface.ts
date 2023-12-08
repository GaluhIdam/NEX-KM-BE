import { Response } from 'express';

export interface NexRoleControllerInterface {
  showAllDataSldiers(
    res: Response,
    page: number,
    limit: number,
  ): Promise<Response>;

  /**
   *
   * @param res @Res
   * @param data @Body
   */
  createNexRole(res: Response, data: any): Promise<Response>;

  deleteNexRoleByUUID(res: Response, uuid: string): Promise<Response>;

  updateNexRoleByUUID(
    res: Response,
    data: any,
    uuid: string,
  ): Promise<Response>;

  detailNexRoleUsingUUID(res: Response, uuid: string): Promise<Response>;
}
