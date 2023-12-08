import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { EbookCollectionReadServiceInterface } from '../interfaces/ebook-collection-read.service.interface';
import { EbookCollection, EbookRead } from '@prisma/clients/nex-library';
import { EbookCollectionReadDTO } from '../dtos/ebook-collection-read.dto';
import { PrismaLibraryService } from 'src/core/services/prisma-nex-library.service';
import { PaginationDTO } from 'src/core/dtos/pagination.dto';

@Injectable()
export class EbookCollectionReadService
  extends AppError
  implements EbookCollectionReadServiceInterface
{
  constructor(private readonly prisma: PrismaLibraryService) {
    super(EbookCollectionReadService.name);
  }

  //Get Ebook Collection
  async getEbookCollection(
    page: number,
    limit: number,
    personalNumber?: string,
    search?: string,
    sortBy?: string,
  ): Promise<PaginationDTO<EbookCollection[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const by_order = {};

    if (sortBy == 'desc' || sortBy == 'asc') {
      by_order['createdAt'] = sortBy;
    }

    let where = {};

    const filters = [];

    if (personalNumber) {
      filters.push({ personalNumber: personalNumber });
    }

    if (search) {
      filters.push({
        OR: [
          {
            collectionEbook: {
              title: { contains: search, mode: 'insensitive' },
            },
          },
          {
            collectionEbook: {
              synopsis: { contains: search, mode: 'insensitive' },
            },
          },
          {
            collectionEbook: {
              overview: { contains: search, mode: 'insensitive' },
            },
          },
          {
            collectionEbook: {
              author: { contains: search, mode: 'insensitive' },
            },
          },
          {
            collectionEbook: {
              aboutAuthor: { contains: search, mode: 'insensitive' },
            },
          },
          {
            AND: [
              {
                collectionEbook: {
                  title: { contains: search, mode: 'insensitive' },
                },
              },
              {
                collectionEbook: {
                  synopsis: { contains: search, mode: 'insensitive' },
                },
              },
              {
                collectionEbook: {
                  overview: { contains: search, mode: 'insensitive' },
                },
              },
              {
                collectionEbook: {
                  author: { contains: search, mode: 'insensitive' },
                },
              },
              {
                collectionEbook: {
                  aboutAuthor: { contains: search, mode: 'insensitive' },
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

    console.log(where);

    const result = await this.prisma.ebookCollection.findMany({
      where: where,
      take: take,
      skip: skip,
      orderBy: by_order,
      include: {
        collectionEbook: true,
      },
    });

    const totalItems = await this.prisma.ebookCollection.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<EbookCollection[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Ebook Collection');
    return response;
  }

  //Create Ebook Collection
  async createEbookCollection(
    dto: EbookCollectionReadDTO,
  ): Promise<EbookCollection> {
    const findEbookData = await this.prisma.ebook.findFirst({
      where: {
        id: dto.ebookId,
      },
    });
    this.handlingErrorNotFound(findEbookData, findEbookData.uuid, 'Ebook');

    const findEbookCollectionData = await this.prisma.ebookCollection.findFirst(
      {
        where: {
          collectionEbook: {
            id: findEbookData.id,
          },
        },
        include: {
          collectionEbook: true,
        },
      },
    );

    this.handlingErrorDuplicateData(
      findEbookCollectionData,
      findEbookCollectionData?.uuid,
      'Ebook Collection',
    );

    const result = await this.prisma.ebookCollection.create({
      data: {
        personalNumber: dto.personalNumber,
        ebookId: dto.ebookId,
      },
    });
    return result;
  }

  //Check Ebook Collection Exist
  async checkEbookCollectionExist(
    dto: EbookCollectionReadDTO,
  ): Promise<EbookCollection> {
    const findCollectionData = await this.prisma.ebookCollection.findFirst({
      where: {
        AND: [{ personalNumber: dto.personalNumber }, { ebookId: dto.ebookId }],
      },
    });

    return findCollectionData;
  }

  //Delete Ebook Collection
  async deleteEbookCollection(uuid: string): Promise<EbookCollection> {
    const findData = await this.prisma.ebookCollection.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Ebook Collection');
    return await this.prisma.ebookCollection.delete({
      where: {
        uuid: uuid,
      },
    });
  }

  //Get Ebook Read
  async getEbookRead(
    page: number,
    limit: number,
    personalNumber?: string,
    search?: string,
    sortBy?: string,
  ): Promise<PaginationDTO<EbookRead[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const by_order = {};

    if (sortBy == 'desc' || sortBy == 'asc') {
      by_order['createdAt'] = sortBy;
    }

    let where = {};

    const filters = [];

    if (personalNumber) {
      filters.push({ personalNumber: personalNumber });
    }

    if (search) {
      filters.push({
        OR: [
          {
            readEbook: { title: { contains: search, mode: 'insensitive' } },
          },
          {
            readEbook: {
              synopsis: { contains: search, mode: 'insensitive' },
            },
          },
          {
            readEbook: {
              overview: { contains: search, mode: 'insensitive' },
            },
          },
          {
            readEbook: {
              author: { contains: search, mode: 'insensitive' },
            },
          },
          {
            readEbook: {
              aboutAuthor: { contains: search, mode: 'insensitive' },
            },
          },
          {
            AND: [
              {
                readEbook: {
                  title: { contains: search, mode: 'insensitive' },
                },
              },
              {
                readEbook: {
                  synopsis: { contains: search, mode: 'insensitive' },
                },
              },
              {
                readEbook: {
                  overview: { contains: search, mode: 'insensitive' },
                },
              },
              {
                readEbook: {
                  author: { contains: search, mode: 'insensitive' },
                },
              },
              {
                readEbook: {
                  aboutAuthor: { contains: search, mode: 'insensitive' },
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

    const result = await this.prisma.ebookRead.findMany({
      where: where,
      take: take,
      skip: skip,
      orderBy: by_order,
      include: {
        readEbook: true,
      },
    });

    const totalItems = await this.prisma.ebookRead.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const response: PaginationDTO<EbookCollection[]> = {
      page: Number(page),
      limit: take,
      totalItems: totalItems,
      totalPages: totalPages,
      data: result,
    };

    this.handlingErrorEmptyDataPagination(response, 'Ebook Read');
    return response;
  }

  //Create Ebook Read
  async createEbookRead(dto: EbookCollectionReadDTO): Promise<EbookRead> {
    const result = await this.prisma.ebookRead.create({
      data: {
        personalNumber: dto.personalNumber,
        ebookId: dto.ebookId,
      },
    });
    return result;
  }

  //Delete Ebook Read
  async deleteEbookRead(uuid: string): Promise<EbookRead> {
    const findData = await this.prisma.ebookRead.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Ebook Read');
    return await this.prisma.ebookRead.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
