import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoleDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  page: string;
}

export class RolePermissionDTO {
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsNumber()
  masterPermissionId: number;
}

export class MasterPermissionDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class PermissionMasterNameOnlyDTO {
  name: string;
}

// For Service
export class RoleCreateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  page: string;

  @IsArray()
  permission: RolePermissionCreateDTO[];
}

export class RolePermissionCreateDTO {
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsNumber()
  masterPermissionId: number;
}

export class UserInRoleCreateDTO {
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
