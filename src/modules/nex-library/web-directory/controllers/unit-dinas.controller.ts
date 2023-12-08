import { Body, Controller, Post, Res, Get, Query, Put, Param, Delete } from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { UnitDinasControllerInterface } from '../interfaces/unit-dinas.controller.interface';
import { UnitDinasDTO } from '../dtos/unit-dinas.dto';
import { UnitDinasService } from '../services/unit-dinas.service';
import { Response } from 'express';

@Controller({ path: 'api/unit-dinas', version: '1' })
export class UnitDinasController extends BaseController implements UnitDinasControllerInterface {

    constructor(
        private readonly unitdinasService: UnitDinasService
    ) {
        super(UnitDinasController.name)
    }

    //Get All Unit Dinas
    @Get('/all')
    async getAllUnitDinas(
        @Res() res: Response<any, Record<string, any>>
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const result = await this.unitdinasService.getAllUnitDinas();
            return res.status(200).send(
                this.responseMessage('unit', 'Get all', 200, result)
            );
        } catch (error) {
            throw error;
        }
    }

    //Get Unit Dinas with Page Limit
    @Get()
    async getUnitDinas(
        @Res() res: Response<any, Record<string, any>>,
        @Query('page') page: number,
        @Query('limit') limit: number
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.validatePageLimit(page, limit)
            const result = await this.unitdinasService.getUnitDinas(page, limit);
            return res.status(200).send(
                this.responseMessage('unit', 'Get', 200, result)
            );
        } catch (error) {
            throw error;
        }
    }

    //Create Unit Dinas
    @Post()
    async createUnitDinas(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: UnitDinasDTO): Promise<Response<any, Record<string, any>>> {
        try {
            await this.errorsValidation(UnitDinasDTO, dto);
            const result = await this.unitdinasService.createUnitDinas(dto);
            return res.status(201).send(
                this.responseMessage('unit', 'Create', 201, result)
            )
        } catch (error) {
            throw error;
        }
    }

    //Update Unit Dinas
    @Put('/:uuid')
    async updateUnitDinas(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string,
        @Body() dto: UnitDinasDTO
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            await this.errorsValidation(UnitDinasDTO, dto);
            const result = await this.unitdinasService.updateUnitDinas(uuid, dto);
            return res.status(200).send(
                this.responseMessage('unit', 'Update', 200, result)
            );
        } catch (error) {
            throw error;
        }
    }

    //Delete Unit Dinas
    @Delete('/:uuid')
    async deleteUnitDinas(
        @Res() res: Response<any, Record<string, any>>,
        @Param('uuid') uuid: string
    ): Promise<Response<any, Record<string, any>>> {
        try {
            this.isValidUUID(uuid);
            const result = await this.unitdinasService.deleteUnitDinas(uuid);
            return res.status(200).send(
                this.responseMessage('unit', 'Delete', 200, result)
            );
        } catch (error) {
            throw error;
        }
    }

}
