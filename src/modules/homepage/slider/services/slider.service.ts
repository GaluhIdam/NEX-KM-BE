import { Injectable } from '@nestjs/common';
import { SliderServiceInterface } from '../interfaces/slider.service.interface';
import { Sliders } from '@prisma/clients/homepage';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import { AppError } from 'src/core/errors/app.error';
import { ResponseDTO } from 'src/core/dtos/response.dto';
import { unlinkSync } from 'fs';
import { SliderDTO } from '../dtos/slider.dto';

@Injectable()
export class SliderService extends AppError implements SliderServiceInterface {
  constructor(private readonly prisma: PrismaHomepageService) {
    super(SliderService.name);
  }

  //Get By Uuid
  async getSliderByUuid(uuid: string): Promise<Sliders> {
    try {
      const findData = await this.prisma.sliders.findFirst({
        where: {
          uuid: uuid,
        },
      });
      this.handlingErrorNotFound(findData, uuid, 'slider');
      return findData;
    } catch (error) {
      throw error;
    }
  }

  //Get Slider
  async getSlider(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    isAdmin: boolean,
  ): Promise<ResponseDTO<Sliders[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const by_order = [];

    if (sortBy === 'desc') {
      by_order.push({
        createdAt: 'desc',
      });
    }
    if (sortBy === 'asc') {
      by_order.push({
        createdAt: 'asc',
      });
    }

    if (isAdmin === true) {
      const result = await this.prisma.sliders.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { uploadedBy: { contains: search, mode: 'insensitive' } },
            {
              AND: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { uploadedBy: { contains: search, mode: 'insensitive' } },
              ],
            },
          ],
        },
        take: take,
        skip: skip,
        orderBy: by_order,
      });
      this.handlingErrorEmptyData(result, 'slider');
      const total = await this.prisma.sliders.count({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { uploadedBy: { contains: search, mode: 'insensitive' } },
            {
              AND: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { uploadedBy: { contains: search, mode: 'insensitive' } },
              ],
            },
          ],
        },
      });

      const data: ResponseDTO<Sliders[]> = {
        result: result,
        total: total,
      };
      return data;
    } else {
      const result = await this.prisma.sliders.findMany({
        where: {
          status: true,
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { uploadedBy: { contains: search, mode: 'insensitive' } },
            {
              AND: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { uploadedBy: { contains: search, mode: 'insensitive' } },
              ],
            },
          ],
        },
        take: take,
        skip: skip,
        orderBy: by_order,
      });
      this.handlingErrorEmptyData(result, 'slider');
      const total = await this.prisma.sliders.count({
        where: {
          status: true,
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { uploadedBy: { contains: search, mode: 'insensitive' } },
            {
              AND: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { uploadedBy: { contains: search, mode: 'insensitive' } },
              ],
            },
          ],
        },
      });

      const data: ResponseDTO<Sliders[]> = {
        result: result,
        total: total,
      };
      return data;
    }
  }

  //Create Slider
  async createSlider(dto: SliderDTO): Promise<Sliders> {
    return await this.prisma.sliders.create({
      data: {
        ...dto,
      },
    });
  }

  //Update Slider
  async updateSlider(uuid: string, dto: SliderDTO): Promise<Sliders> {
    const findData = await this.prisma.sliders.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'slider');
    unlinkSync(`./uploads/${findData.backgroundImage}`);
    return await this.prisma.sliders.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...dto,
      },
    });
  }

  //Delete Slider
  async deleteSlider(uuid: string): Promise<Sliders> {
    const findData = await this.prisma.sliders.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'slider');
    unlinkSync(`./uploads/${findData.backgroundImage}`);
    return await this.prisma.sliders.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
