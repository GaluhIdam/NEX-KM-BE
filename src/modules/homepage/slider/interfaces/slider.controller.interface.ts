import { Response } from 'express';
import { SliderDTO } from '../dtos/slider.dto';

export interface SliderControllerInterface {
  getSliderByUuid(res: Response, uuid: string): Promise<Response>;

  getSlider(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    isAdmin: boolean,
  ): Promise<Response>;

  createSlider(
    res: Response,
    dto: SliderDTO,
    image: Express.Multer.File,
  ): Promise<Response>;

  updateSlider(
    res: Response,
    uuid: string,
    dto: SliderDTO,
    image: Express.Multer.File,
  ): Promise<Response>;

  deleteSlider(res: Response, uuid: string): Promise<Response>;
}
