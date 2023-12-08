import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { UnitDinasServiceInterface } from '../interfaces/unit-dinas.service.interface';
import { UnitDinas } from '@prisma/clients/nex-library';
import { UnitDinasDTO } from '../dtos/unit-dinas.dto';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';

@Injectable()
export class UnitDinasService
    extends AppError
    implements UnitDinasServiceInterface
{
    constructor(private readonly prisma: PrismaLibraryService) {
        super(UnitDinasService.name);
    }

    //Get Unit Dinas By PK
    async getUnitDinasByPK(id_unit_dinas: number): Promise<UnitDinas> {
        const result = await this.prisma.unitDinas.findFirst({
            where: {
                id: id_unit_dinas,
            },
        });
        this.handlingErrorNotFound(result, id_unit_dinas, 'Unit Dinas');
        return result;
    }

    //Get All Unit Dinas
    async getAllUnitDinas(): Promise<UnitDinas[]> {
        const result = await this.prisma.unitDinas.findMany();
        this.handlingErrorEmptyData(result, 'Unit Dinas');
        return result;
    }

    //Get Unit Dinas with page & number
    async getUnitDinas(page: number, limit: number): Promise<UnitDinas[]> {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const result = await this.prisma.unitDinas.findMany({
            take: take,
            skip: skip,
        });
        this.handlingErrorEmptyData(result, 'Unit Dinas');
        return result;
    }

    //Create Unit Dinas
    async createUnitDinas(dto: UnitDinasDTO): Promise<UnitDinas> {
        return this.prisma.unitDinas.create({
            data: {
                name: dto.name,
                code: dto.code,
                personalNumber: dto.personalNumber,
            },
        });
    }

    //Update Unit Dinas
    async updateUnitDinas(uuid: string, dto: UnitDinasDTO): Promise<UnitDinas> {
        const finddata = await this.prisma.unitDinas.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(finddata, uuid, 'Unit Dinas');
        return this.prisma.unitDinas.update({
            where: {
                uuid: uuid,
            },
            data: {
                name: dto.name,
                code: dto.code,
                personalNumber: dto.personalNumber,
            },
        });
    }

    //Delete Unit Dinas
    async deleteUnitDinas(uuid: string): Promise<UnitDinas> {
        const finddata = await this.prisma.unitDinas.findFirst({
            where: {
                uuid: uuid,
            },
        });
        this.handlingErrorNotFound(finddata, uuid, 'Unit Dinas');
        return this.prisma.unitDinas.delete({
            where: {
                uuid: uuid,
            },
        });
    }
}
