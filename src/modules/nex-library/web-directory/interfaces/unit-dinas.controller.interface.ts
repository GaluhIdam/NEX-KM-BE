import { Response } from 'express';
import { UnitDinasDTO } from '../dtos/unit-dinas.dto';

export interface UnitDinasControllerInterface {

    getAllUnitDinas(res: Response): Promise<Response>;

    getUnitDinas(res: Response, page: number, limit: number): Promise<Response>;

    createUnitDinas(res: Response, dto: UnitDinasDTO): Promise<Response>;

    updateUnitDinas(res: Response, uuid: string, dto: UnitDinasDTO): Promise<Response>;

    deleteUnitDinas(res: Response, uuid: string): Promise<Response>;
}