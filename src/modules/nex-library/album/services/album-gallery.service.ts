import { Injectable } from '@nestjs/common';
import { AlbumGalleryServiceInterface } from '../interfaces/album-gallery.services.interface';
import { AlbumGallery } from '@prisma/clients/nex-library';
import { AlbumGalleryDTO } from '../dtos/album-gallery.dto';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { unlinkSync } from 'fs';
import { AppError } from 'src/core/errors/app.error';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';

@Injectable()
export class AlbumGalleryService
  extends AppError
  implements AlbumGalleryServiceInterface
{
  constructor(private readonly prisma: PrismaLibraryService) {
    super(AlbumGalleryService.name);
  }

  //Get Album Gallery
  async getAlbumGallery(
    page: number,
    limit: number,
  ): Promise<PaginationDTO<AlbumGallery[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const result = await this.prisma.albumGallery.findMany({
      take: take,
      skip: skip,
    });

    const totalItems = await this.prisma.albumGallery.count();
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<AlbumGallery[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Album Gallery');
    return response;
  }

  //Get Album Gallery By Id
  async getAlbumGalleryById(uuid: string): Promise<AlbumGallery> {
    const result = await this.prisma.albumGallery.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(result, uuid, 'Album Gallery');
    return result;
  }

  //Get Album Gallery By Album Id
  async getAlbumGalleryByAlbumId(id_album: number): Promise<AlbumGallery[]> {
    const findData = await this.prisma.albumGallery.findMany({
      where: {
        albumId: id_album,
      },
    });
    if (findData) {
      findData.forEach(async (data) => {
        unlinkSync(`./uploads/album/album-gallery/${data.name}`);
      });
    }
    return findData;
  }

  //Get Album Gallery Pagination By Album Id
  async getAlbumGalleryPaginateByAlbumId(
    id_album: number,
    page: number,
    limit: number,
  ): Promise<PaginationDTO<AlbumGallery[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    if (id_album) {
      const where = {
        albumId: id_album,
      };

      const result = await this.prisma.albumGallery.findMany({
        where: where,
        take: take,
        skip: skip,
      });

      const totalItems = await this.prisma.albumGallery.count({ where });
      const totalPages = Math.ceil(totalItems / take);

      const response: PaginationDTO<AlbumGallery[]> = {
        page: Number(page),
        limit: take,
        totalItems: totalItems,
        totalPages: totalPages,
        data: result,
      };

      this.handlingErrorEmptyDataPagination(response, 'Album Gallery');
      return response;
    }
  }

  //Post Album Gallery
  async createAlbumGallery(dto: AlbumGalleryDTO): Promise<AlbumGallery> {
    try {
      const findData = await this.prisma.album.findFirst({
        where: {
          id: dto.albumId,
        },
      });
      this.handlingErrorNotFound(findData, dto.albumId, 'Album');
    } catch (error) {
      unlinkSync(`./uploads/${dto.path}`);
      throw error;
    }

    return await this.prisma.albumGallery.create({
      data: {
        personalNumber: dto.personalNumber,
        albumId: dto.albumId,
        name: dto.name,
        path: dto.path,
      },
    });
  }

  //Update Album Gallery
  async updateAlbumGallery(
    uuid: string,
    dto: AlbumGalleryDTO,
  ): Promise<AlbumGallery> {
    const findData = await this.prisma.albumGallery.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Album Gallery');
    return await this.prisma.albumGallery.update({
      data: {
        name: dto.name,
        personalNumber: dto.personalNumber,
      },
      where: {
        uuid: uuid,
      },
    });
  }

  //Delete Album Gallery
  async deleteAlbumGallery(uuid: string): Promise<AlbumGallery> {
    const findData = await this.prisma.albumGallery.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Album Gallery');
    return await this.prisma.albumGallery.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
