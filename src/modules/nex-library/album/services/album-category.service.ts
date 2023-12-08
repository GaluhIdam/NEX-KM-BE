import { Injectable } from '@nestjs/common';
import { AlbumCategory } from '@prisma/clients/nex-library';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { AlbumCategoryServiceInterface } from '../interfaces/album-category.services.interface';
import { AlbumCategoryDTO } from '../dtos/album-category.dto';
import { AppError } from 'src/core/errors/app.error';
import { AlbumCategoryStatusDTO } from '../dtos/album-category-status.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';

@Injectable()
export class AlbumCategoryService
  extends AppError
  implements AlbumCategoryServiceInterface
{
  constructor(private readonly prisma: PrismaLibraryService) {
    super(AlbumCategoryService.name);
  }

  //Get Album Category With Limit (page & limit)
  async getAlbumCategory(
    page: number,
    limit: number,
    search?: string,
    is_active?: boolean,
  ): Promise<PaginationDTO<AlbumCategory[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    let where = undefined;

    if (is_active !== null) {
      if (search) {
        where = {
          AND: [
            { OR: [{ isActive: is_active }] },
            {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                {
                  AND: [{ name: { contains: search, mode: 'insensitive' } }],
                },
              ],
            },
          ],
        };
      } else {
        where = {
          AND: [{ OR: [{ isActive: is_active }] }],
        };
      }
    } else {
      if (search) {
        where = {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            {
              AND: [{ name: { contains: search, mode: 'insensitive' } }],
            },
          ],
        };
      }
    }

    const result = await this.prisma.albumCategory.findMany({
      where: where,
      take: take,
      skip: skip,
      include: {
        albumCategory: true,
      },
    });

    const totalItems = await this.prisma.albumCategory.count();
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<AlbumCategory[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Album Category');
    return response;
  }

  //Get Album Category By Id
  async getAlbumCategoryById(
    id_album_category: number,
  ): Promise<AlbumCategory> {
    const result = await this.prisma.albumCategory.findFirst({
      where: {
        id: id_album_category,
      },
    });
    this.handlingErrorNotFound(result, id_album_category, 'Album Category');
    return result;
  }

  //Create Album Category
  async createAlbumCategory(dto: AlbumCategoryDTO): Promise<AlbumCategory> {
    return await this.prisma.albumCategory.create({
      data: {
        name: dto.name,
        personalNumber: dto.personalNumber,
        isActive: true,
      },
    });
  }

  //Update Album Category (General)
  async updateAlbumCategory(
    uuid: string,
    dto: AlbumCategoryDTO,
  ): Promise<AlbumCategory> {
    const findData = await this.prisma.albumCategory.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Album Category');
    return await this.prisma.albumCategory.update({
      data: {
        name: dto.name,
        personalNumber: dto.personalNumber,
      },
      where: {
        uuid: uuid,
      },
    });
  }

  //Update Album Category Status
  async updateAlbumCategoryStatus(
    uuid: string,
    dto: AlbumCategoryStatusDTO,
  ): Promise<AlbumCategory> {
    const findData = await this.prisma.albumCategory.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Album Category');
    return await this.prisma.albumCategory.update({
      data: {
        isActive: dto.isActive,
      },
      where: {
        uuid: uuid,
      },
    });
  }

  //Delete Album Category
  async deleteAlbumCategory(uuid: string): Promise<AlbumCategory> {
    const findData = await this.prisma.albumCategory.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Album Category');
    return await this.prisma.albumCategory.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
