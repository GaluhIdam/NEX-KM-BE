import { Roles, UserRole } from '@prisma/clients/homepage';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import {
  RoleCreateDTO,
  UserInRoleCreateDTO,
} from '../dtos/role-permission.dto';

export interface RolePermissionServiceInterface {
  getRolePermission(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Roles[]>>;

  createRolePermission(dto: RoleCreateDTO): Promise<Roles>;

  updateRolePermission(uuid: string, dto: RoleCreateDTO): Promise<Roles>;

  deleteRolePermission(uuid: string): Promise<Roles>;

  getUserInRole(
    roleId: number,
    page: number,
    limit: number,
    search: string,
  ): Promise<ResponseDTO<UserRole[]>>;

  createUserInRole(dto: UserInRoleCreateDTO): Promise<UserRole>;

  deleteUserInRole(uuid: string): Promise<UserRole>;

  getPermissionInRole(uuid: string): Promise<Roles>;
}
