import {
  BadRequestException,
  HttpException,
  HttpStatus,
  PipeTransform,
  Res,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { unlinkSync } from 'fs';
import {
  HistoryPointDTO,
  PointDTO,
} from 'src/modules/nex-level/point/dtos/point.dto';
import { PointConfigService } from 'src/modules/nex-level/point-config/services/point-config.service';
import { PointService } from 'src/modules/nex-level/point/services/point.service';
import { PrismaLevelService } from '../services/prisma-nex-level.service';

export abstract class BaseController {
  private appName: string;

  constructor(instanceName: string) {
    this.appName = instanceName;
  }

  async checkPoint(
    activity: string,
    personalNumber: string,
    status: boolean | null,
  ): Promise<void> {
    try {
      const prisma = new PrismaLevelService();
      const pointconfigService = new PointConfigService(prisma);
      const pointService = new PointService(prisma);

      const findPoint = await pointconfigService.getPointConfigByActivity(
        activity,
      );
      const point = await pointService.getPointByPersonalNumber(personalNumber);
      if (point && findPoint) {
        const dataPoint: PointDTO = {
          personalNumber: point.personalNumber,
          personalName: point.personalName,
          personalUnit: point.personalUnit,
          title: point.title,
          personalEmail: point.personalEmail,
          point: point.point + findPoint.point,
          totalPoint: point.totalPoint + findPoint.point,
        };
        const dataHistoryPoint: HistoryPointDTO = {
          personalNumber: point.personalNumber,
          activity: activity,
          point: findPoint.point,
          status: status,
        };
        await pointService.createHistoryPoint(dataHistoryPoint);
        if (status === true) {
          await pointService.updatePoint(point.uuid, dataPoint);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  //Validation Multiple Images
  validateMutipleImage(images: Express.Multer.File[]): void {
    if (!images || images.length <= 0) {
      throw new BadRequestException('Image is required!');
    }
    if (images.length > 1) {
      images.forEach((data) => {
        if (data.mimetype !== 'image/jpeg' && data.mimetype !== 'image/png') {
          unlinkSync(data.path);
          throw new BadRequestException('Image must be JPEG or PNG!');
        }
        if (data.size > 1000000) {
          unlinkSync(data.path);
          throw new BadRequestException('Images must be under 1 MB in size!');
        }
      });
    }
    if (images.length === 1) {
      if (
        images[0].mimetype !== 'image/jpeg' &&
        images[0].mimetype !== 'image/png'
      ) {
        unlinkSync(images[0].path);
        throw new BadRequestException('Image must be JPEG or PNG!');
      }
      if (images[0].size > 1000000) {
        unlinkSync(images[0].path);
        throw new BadRequestException('Images must be under 1 MB in size!');
      }
    }
  }

  //Validation Single Image
  validateSingleImage(image: Express.Multer.File, params?: any): void {
    if (!image) {
      if (params) {
        throw new BadRequestException(`${params} is required!`);
      } else {
        throw new BadRequestException('Image is required!');
      }
    }
    if (
      image.mimetype !== 'image/jpeg' &&
      image.mimetype !== 'image/png' &&
      image.mimetype !== 'image/jpg'
    ) {
      unlinkSync(image.path);
      throw new BadRequestException('Image must be JPEG or PNG!');
    }
    if (image.size > 1000000) {
      unlinkSync(image.path);
      throw new BadRequestException('Images must be under 1 MB in size!');
    }
    return;
  }

  //Validation PDF
  validatePDF(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('File is required!');
    }
    if (file.mimetype !== 'application/pdf') {
      unlinkSync(file.path);
      throw new BadRequestException('File must be PDF!');
    }
    if (file.size > 10000000) {
      unlinkSync(file.path);
      throw new BadRequestException('File must be under 10 MB in size!');
    }
  }

  //Validation Video
  validateVideo(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('File is required!');
    }
    if (file.mimetype !== 'video/mp4') {
      unlinkSync(file.path);
      throw new BadRequestException('File must be mp4!');
    }
    if (file.size > 100000000) {
      unlinkSync(file.path);
      throw new BadRequestException('File must be under 100 MB in size!');
    }
  }

  //Validate PDF and Image
  validateImagePDF(
    image: Express.Multer.File,
    file: Express.Multer.File,
  ): void {
    try {
      this.validatePDF(file);
    } catch (error) {
      unlinkSync(image.path);
      throw error;
    }
    try {
      this.validateSingleImage(image);
    } catch (error) {
      unlinkSync(file.path);
      throw error;
    }
  }

  validateUUID<T>(uuid: T): void {
    if (!uuid) {
      throw new BadRequestException('Uuid or ID can not be empty !');
    }
  }

  //Custom Messsage
  customMessageErrors(errors: Array<any>): {
    message: string;
    errors: { field: string; error: { [type: string]: string } }[];
  } {
    const errorList = errors.map((error) => ({
      field: error.property,
      error: error.constraints,
    }));
    const formatError = {
      message: 'Validation Errors',
      errors: errorList,
    };
    return formatError;
  }

  //Validate Page and Limit
  validatePageLimit(page: number, limit: number): void {
    if (!page && !limit) {
      throw new BadRequestException('Page and Limit is required!');
    }
    if (!page) {
      throw new BadRequestException('Page is required!');
    }
    if (!limit) {
      throw new BadRequestException('Limit is required!');
    }
  }

  //Validate Data & Image
  validateMultipleDataImage<T>(data: Array<T>, images: Array<T>): void {
    if (data.length !== images.length) {
      throw new BadRequestException('Data and Images total must be same!');
    }
  }

  //Handling Validation Error
  async errorsValidation<T>(
    dto: any,
    data: T,
    image?: Express.Multer.File,
    file?: Express.Multer.File,
  ) {
    const errors = await validate(plainToClass(dto, data));
    if (errors.length > 0) {
      if (image) {
        unlinkSync(image.path);
      }
      if (file) {
        unlinkSync(file.path);
      }
      throw new BadRequestException(this.customMessageErrors(errors));
    }
    return;
  }

  //Validation Audio
  validateAudio(audio: Express.Multer.File): void {
    if (!audio) {
      throw new BadRequestException('Audio is required!');
    }
    if (audio.mimetype !== 'audio/mpeg') {
      unlinkSync(audio.path);
      throw new BadRequestException('Audio must be mp3!');
    }
    if (audio.size > 209715200) {
      unlinkSync(audio.path);
      throw new BadRequestException('Audio must be under 200 MB in size!');
    }
  }

  //Custom Response
  responseMessage(subject: string, action: string, status: number, data: any) {
    const response = {
      message: `${action} ${subject} was successfully!`,
      status: status,
      data: data,
    };
    return response;
  }

  isValidUUID(uuid: string): void {
    const uuidPattern =
      /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89aAbB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/;
    const test = uuidPattern.test(uuid);
    if (test == true) {
      return;
    }
    throw new BadRequestException('Uuid is not valid !');
  }

  validationBooleanParams(param: string): boolean {
    if (param.toLowerCase() === 'true') {
      return true;
    } else if (param.toLowerCase() === 'false') {
      return false;
    } else {
      throw new BadRequestException('boolean is not valid');
    }
  }

  //Validation Dual Image
  validateDualImage(
    imageOne: Express.Multer.File,
    imageTwo: Express.Multer.File,
  ): void {
    if (imageOne && imageTwo) {
      this.validateSingleImage(imageOne[0]);
      this.validateSingleImage(imageTwo[0]);
    } else {
      if (!imageOne && !imageTwo) {
        throw new BadRequestException('Please complete the image file!');
      }
      if (imageOne) {
        unlinkSync(imageOne[0].path);
        throw new BadRequestException('Please complete the image file!');
      }
      if (imageTwo) {
        unlinkSync(imageTwo[0].path);
        throw new BadRequestException('Please complete the image file!');
      }
    }
  }
}
