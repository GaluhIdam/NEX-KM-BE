import { HttpException, Injectable } from '@nestjs/common';
import { NexTeamServiceInterface } from '../interfaces/nex-team.service.interface';
import { NexTeams } from '@prisma/clients/homepage';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import { AppError } from 'src/core/errors/app.error';
import { GetUsersQueryDTO, CreateNexTeamDTO, UpdateNexTeamDTO } from '../dtos';
import { ResponseDTO } from 'src/core/dtos/response.dto';

@Injectable()
export class NexTeamService
    extends AppError
    implements NexTeamServiceInterface
{
    constructor(private readonly prisma: PrismaHomepageService) {
        super(NexTeamService.name);
    }

    async findFirstHundredNexTeamsData(
        queryParams: GetUsersQueryDTO,
    ): Promise<ResponseDTO<NexTeams[]>> {
        const { limit, page, search, sortBy, position } = queryParams;
        const take = limit;
        const skip = (page - 1) * take;
        const orderBy = [];

        switch (sortBy) {
            case 'noASC':
                orderBy.push({ id: 'asc' });
                break;
            case 'memberASC':
                orderBy.push({ personnelNumber: 'asc' });
                break;
            case 'positionASC':
                orderBy.push({ position: 'asc' });
                break;
            case 'noDESC':
                orderBy.push({ id: 'desc' });
                break;
            case 'memberDESC':
                orderBy.push({ personnelNumber: 'desc' });
                break;
            case 'positionDESC':
                orderBy.push({ position: 'desc' });
                break;
            default:
                orderBy.push({ createdAt: 'desc' });
                break;
        }

        let where = {};

        const filters = [];

        if (position) {
            filters.push({ position: position });
        }

        if (search) {
            filters.push({
                OR: [
                    { position: { contains: search, mode: 'insensitive' } },
                    {
                        personnelNumber: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        AND: [
                            {
                                position: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                personnelNumber: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            });
        }

        if (filters.length > 0) {
            where = { AND: filters };
        }

        const nexTeams: NexTeams[] = await this.prisma.nexTeams.findMany({
            where: where,
            take,
            skip,
            orderBy,
        });

        this.handlingErrorEmptyData(nexTeams, 'nex teams');

        const data: ResponseDTO<NexTeams[]> = {
            result: nexTeams,
            total: nexTeams.length,
        };
        return data;
    }

    async findNexTeamByUUID(uuid: string): Promise<NexTeams> {
        console.log(uuid);
        const nexTeam: NexTeams = await this.prisma.nexTeams.findUnique({
            where: { uuid },
        });

        this.handlingErrorNotFound(nexTeam, uuid, 'Find');

        return await this.prisma.nexTeams.findUnique({
            where: { uuid },
        });
    }

    async findNexTeamByPersonnelNumber(
        personnelNumber: string,
    ): Promise<NexTeams> {
        const nexTeam: NexTeams = await this.prisma.nexTeams.findUnique({
            where: { personnelNumber },
        });

        this.handlingErrorNotFound(nexTeam, personnelNumber, 'Find');

        return await this.prisma.nexTeams.findUnique({
            where: { personnelNumber },
        });
    }

    async createNexTeamData(dto: CreateNexTeamDTO): Promise<NexTeams> {
        const nexteam = await this.prisma.nexTeams.findUnique({
            where: { personnelNumber: dto.personnelNumber },
        });

        this.handlingErrorDuplicateData(nexteam, nexteam?.uuid, 'nex team');

        return await this.prisma.nexTeams.create({
            data: { ...dto },
        });
    }

    async deleteNexTeamDataByUUID(uuid: string): Promise<void> {
        const team: NexTeams = await this.prisma.nexTeams.findUnique({
            where: { uuid },
        });

        this.handlingErrorNotFound(team, uuid, 'nex teams');

        await this.prisma.nexTeams.delete({
            where: { uuid },
        });
    }

    async updateNexTeamDataByPersonnelNumber(
        dto: UpdateNexTeamDTO,
        personnelNumber: string,
    ): Promise<NexTeams> {
        const nexTeam: NexTeams = await this.prisma.nexTeams.findUnique({
            where: { personnelNumber },
        });

        if (!nexTeam) {
            throw new HttpException('Member Nex Team not found', 403);
        }

        return await this.prisma.nexTeams.update({
            where: { personnelNumber },
            data: { position: dto.position },
        });
    }
}
