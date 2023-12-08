import { HttpException, HttpStatus } from '@nestjs/common';
import { PaginationDTO } from '../dtos/pagination.dto';

export abstract class AppError {
  private appName: string;

  constructor(instanceName: string) {
    this.appName = instanceName;
  }

  //Error Handle Error when data is empty
  handlingErrorEmptyData<T>(result: Array<T>, subject: any) {
    if (result.length === 0) {
      const errors_message = {
        code: 200,
        message: `Sorry, Data ${subject} is empty !`,
        data: result,
      };
      throw new HttpException(errors_message, HttpStatus.OK);
    }
  }

  //Error Handle Error when data pagination is empty
  handlingErrorEmptyDataPagination<T>(
    result: PaginationDTO<Array<T>>,
    subject: any,
  ) {
    if (result.data.length === 0) {
      const errors_message = {
        code: 200,
        message: `Sorry, Data ${subject} is empty !`,
        data: result,
      };
      throw new HttpException(errors_message, HttpStatus.OK);
    }
  }

  //Error Handle Error when data not found
  handlingErrorNotFound<T>(result: T, uuid: any, subject: any) {
    if (result === null) {
      const errors_message = {
        code: 404,
        'UUID/ID': uuid,
        message: `Sorry, Data ${subject} not found !`,
        data: result,
      };
      throw new HttpException(errors_message, HttpStatus.OK);
    }
  }

  //Error Handle Duplicate Data
  handlingErrorDuplicateData<T>(result: T, uuid: any, subject: any) {
    if (result !== null) {
      const errors_message = {
        code: 403,
        'UUID/ID': uuid,
        message: `Sorry, Data ${subject} already exist`,
        data: null,
      };
      throw new HttpException(errors_message, HttpStatus.FORBIDDEN);
    }
  }
}
