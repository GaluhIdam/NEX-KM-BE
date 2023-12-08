import { Response } from 'express';
import {
  RoleCreateDTO,
  UserInRoleCreateDTO,
} from '../dtos/role-permission.dto';

export interface RolePermissionControllerInterface {
  getRolePermission(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<Response>;

  createRolePermission(res: Response, dto: RoleCreateDTO): Promise<Response>;

  updateRolePermission(
    res: Response,
    uuid: string,
    dto: RoleCreateDTO,
  ): Promise<Response>;

  deleteRolePermission(res: Response, uuid: string): Promise<Response>;

  getUserInRole(
    res: Response,
    roleId: number,
    page: number,
    limit: number,
    search: string,
  ): Promise<Response>;

  createUserInRole(res: Response, dto: UserInRoleCreateDTO): Promise<Response>;

  deleteUserInRole(res: Response, uuid: string): Promise<Response>;
  getPermissionInRole(res: Response, uuid: string): Promise<Response>;
}
