import { UnitDinas } from '@prisma/clients/nex-library';
import { UnitDinasDTO } from '../dtos/unit-dinas.dto';
export interface UnitDinasServiceInterface {

    getAllUnitDinas(): Promise<UnitDinas[]>;

    getUnitDinas(page: number, limit: number, search: string): Promise<UnitDinas[]>;

    getUnitDinasByPK(id_unit_dinas: number): Promise<UnitDinas>;

    createUnitDinas(dto: UnitDinasDTO): Promise<UnitDinas>;

    updateUnitDinas(uuid: string, dto: UnitDinasDTO): Promise<UnitDinas>;

    deleteUnitDinas(uuid: string): Promise<UnitDinas>;
}