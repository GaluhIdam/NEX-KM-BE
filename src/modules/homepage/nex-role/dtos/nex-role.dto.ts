import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class NexRoleDTO {
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  uuid: string;

  createdAt: Date;
  updatedAt: Date;
}
