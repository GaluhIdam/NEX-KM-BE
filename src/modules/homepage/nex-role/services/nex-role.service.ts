import { BadRequestException, Injectable } from '@nestjs/common';
import { NexRoleServiceInterface } from '../interfaces/nex-role.service.interface';
import { NexRoles } from '@prisma/clients/homepage';
import { NexRoleDTO } from '../dtos/nex-role.dto';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NexRoleService implements NexRoleServiceInterface {
  constructor(private readonly prisma: PrismaHomepageService) { }

  async findFirstHundredNexRolesData(
    page: number,
    limit: number,
  ): Promise<NexRoleDTO[]> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    if (take < 0) {
      throw new BadRequestException();
    }

    if (skip < 0) {
      throw new BadRequestException();
    }

    const nexRoles: NexRoles[] = await this.prisma.nexRoles.findMany({
      take: take,
      skip: skip,
    });

    const nexRoleDTO: NexRoleDTO[] = [];

    nexRoles.forEach((val) => {
      [...nexRoleDTO, ...[{}]];
      nexRoleDTO.push({
        id: Number(val.id),
        name: val.name,
        uuid: val.uuid,
        createdAt: val.createdAt,
        updatedAt: val.updatedAt,
      });
    });

    return nexRoleDTO;
  }

  async findNexRoleByUUID(uuid: string): Promise<NexRoles> {
    return await this.prisma.nexRoles.findUnique({
      where: { uuid: uuid },
    });
  }

  async createNexRoleData(dto: NexRoleDTO): Promise<boolean> {
    await this.prisma.nexRoles.create({
      data: {
        name: dto.name,
      },
    });

    return true;
  }

  async deleteNexRoleData(uuid: string): Promise<boolean> {
    await this.prisma.nexRoles.delete({
      where: { uuid: uuid },
    });

    return true;
  }

  async updateNexRoleData(dto: NexRoleDTO, uuid: string): Promise<boolean> {
    await this.prisma.nexRoles.update({
      data: {
        name: dto.name,
      },
      where: {
        uuid: uuid,
      },
    });

    return true;
  }
}