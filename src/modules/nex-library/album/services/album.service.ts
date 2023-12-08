import { Injectable } from '@nestjs/common';
import { AlbumServiceInterface } from '../interfaces/album.services.interface';
import { AlbumDTO } from '../dtos/album.dto';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { Album } from '@prisma/clients/nex-library';
import { unlinkSync } from 'fs';
import { AppError } from 'src/core/errors/app.error';
import { AlbumStatusDTO } from '../dtos/album-status.dto';
import { AlbumStatusApprovalDTO } from '../dtos/album-status-approval.dto';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';
import { AlbumsearchService } from './album-search.service';

@Injectable()
export class AlbumService extends AppError implements AlbumServiceInterface {
  constructor(
    private readonly prisma: PrismaLibraryService,
    private albumSearchService: AlbumsearchService,
  ) {
    super(AlbumService.name);
  }

  async search(query: string): Promise<Record<string, any>> {
    return this.albumSearchService.search(query);
  }

  //Get Album with Limit (page & limit)
  async getAlbum(
    page: number,
    limit: number,
    search?: string,
    id_album_category?: number,
    personalNumber?: string,
    sortBy?: string,
    status?: boolean,
    approvalStatus?: string,
  ): Promise<PaginationDTO<Album[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const by_order = {};

    if (sortBy == 'desc' || sortBy == 'asc') {
      by_order['createdAt'] = sortBy;
    }
    if (sortBy == 'trending') {
      by_order['ebooksEbookReviews'] = {
        _count: 'desc',
      };
    }

    let where = {};

    const filters = [];

    if (status !== null) {
      filters.push({ status: status });
    }

    if (id_album_category) {
      filters.push({ categoryAlbumId: Number(id_album_category) });
    }

    if (personalNumber) {
      filters.push({ personalNumber: personalNumber });
    }

    if (approvalStatus) {
      filters.push({ approvalStatus: approvalStatus });
    }

    if (search) {
      filters.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          {
            AND: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      });
    }

    if (filters.length > 0) {
      where = { AND: filters };
    }

    const result = await this.prisma.album.findMany({
      where: where,
      take: take,
      skip: skip,
      orderBy: by_order,
      include: {
        albumCategory: true,
        galleryAlbum: true,
      },
    });

    const totalItems = await this.prisma.album.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<Album[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Album');
    return response;
  }

  //Get Album By Id
  async getAlbumByPk(id_album: number): Promise<Album> {
    const result = await this.prisma.album.findFirst({
      where: {
        id: id_album,
      },
      include: {
        albumCategory: true,
        galleryAlbum: true,
      },
    });
    this.handlingErrorNotFound(result, id_album, 'Album');
    return;
  }

  //Get Album By Uuid
  async getAlbumById(uuid: string): Promise<Album> {
    const result = await this.prisma.album.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        albumCategory: true,
        galleryAlbum: true,
      },
    });
    this.handlingErrorNotFound(result, uuid, 'Album');
    return result;
  }

  //Get Album by Personal Number with Limit (page & limit)
  async getAlbumByPersonalNumber(
    personal_number: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<Album[]> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const result = await this.prisma.album.findMany({
      where: {
        AND: [
          { personalNumber: personal_number },
          {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              {
                AND: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              },
            ],
          },
        ],
      },
      take: take,
      skip: skip,
      include: {
        albumCategory: true,
        galleryAlbum: true,
      },
    });
    this.handlingErrorEmptyData(result, 'Album');
    return result;
  }

  //Create Album
  async createAlbum(dto: AlbumDTO): Promise<Album> {
    try {
      const findData = await this.prisma.albumCategory.findFirst({
        where: {
          id: dto.categoryAlbum,
        },
      });
      this.handlingErrorNotFound(findData, dto.categoryAlbum, 'Album Category');
    } catch (error) {
      unlinkSync(`./uploads/album/cover/${dto.album_cover}`);
      throw error;
    }
    const album: Album = await this.prisma.album.create({
      data: {
        categoryAlbumId: dto.categoryAlbum,
        albumCover: dto.album_cover,
        title: dto.title,
        description: dto.description,
        personalNumber: dto.personalNumber,
        uploadBy: dto.upload_by,
        unit: dto.unit,
        approvalStatus: 'Waiting Approval',
        descStatus: 'The Album has not been approved by the admin yet.',
        approvalBy: null,
        editorChoice: false,
        status: true,
        path: dto.path,
      },
    });

    this.albumSearchService.indexAlbum(album);
    return album;
  }

  //Update Album (General)
  async updateAlbum(uuid: string, dto: AlbumDTO): Promise<Album> {
    try {
      const findData = await this.prisma.album.findFirst({
        where: {
          uuid: uuid,
        },
      });
      this.handlingErrorNotFound(findData, uuid, 'Album');
      const findData2 = await this.prisma.albumCategory.findFirst({
        where: {
          id: dto.categoryAlbum,
        },
      });
      this.handlingErrorNotFound(
        findData2,
        dto.categoryAlbum,
        'Album Category',
      );
    } catch (error) {
      unlinkSync(`./uploads/album/cover/${dto.album_cover}`);
      throw error;
    }
    const findAlbum = await this.getAlbumById(uuid);
    unlinkSync(`./uploads/album/cover/${findAlbum.albumCover}`);

    const album: Album = await this.prisma.album.update({
      data: {
        categoryAlbumId: dto.categoryAlbum,
        title: dto.title,
        personalNumber: dto.personalNumber,
        description: dto.description,
        albumCover: dto.album_cover,
        path: dto.path,
      },
      where: {
        uuid: uuid,
      },
      include: {
        albumCategory: true,
        galleryAlbum: true,
      },
    });

    await this.albumSearchService.update(album);
    return album;
  }

  //Update Status Album
  async updateAlbumStatus(uuid: string, dto: AlbumStatusDTO): Promise<Album> {
    const findData = await this.prisma.album.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Album');
    const album: Album = await this.prisma.album.update({
      where: {
        uuid: uuid,
      },
      data: {
        status: dto.status,
      },
    });

    await this.albumSearchService.update(album);
    return album;
  }

  //Update Album Status Approval
  async updateAlbumStatusApproval(
    uuid: string,
    dto: AlbumStatusApprovalDTO,
  ): Promise<Album> {
    const findData = await this.prisma.album.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Album');
    const album: Album = await this.prisma.album.update({
      where: {
        uuid: uuid,
      },
      data: {
        approvalStatus: dto.approvalStatus,
        approvalBy: dto.approvalBy,
        descStatus: dto.descStatus ?? '',
      },
    });

    await this.albumSearchService.update(album);
    return album;
  }

  //Delete Album
  async deleteAlbum(uuid: string): Promise<Album> {
    const findAlbum = await this.prisma.album.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findAlbum, uuid, 'Album');

    unlinkSync(`./uploads/${findAlbum.path}`);
    const album: Album = await this.prisma.album.delete({
      where: {
        uuid: uuid,
      },
      include: {
        albumCategory: true,
        galleryAlbum: true,
      },
    });

    await this.albumSearchService.remove(uuid);
    return album;
  }
}
