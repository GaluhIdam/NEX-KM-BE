import { Sliders } from '@prisma/clients/homepage';
import { SliderDTO } from '../dtos/slider.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

export interface SliderServiceInterface {

  getSliderByUuid(uuid: string): Promise<Sliders>;

  getSlider(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    isAdmin: boolean,
  ): Promise<ResponseDTO<Sliders[]>>;

  createSlider(dto: SliderDTO): Promise<Sliders>;

  updateSlider(uuid: string, dto: SliderDTO): Promise<Sliders>;

  deleteSlider(uuid: string): Promise<Sliders>;
}
