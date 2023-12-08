
import { Controller, Post, Res, UploadedFile, UseInterceptors, Get, Param, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller({
  version: '1'
})
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get('api/:filename')
  // getTranscode(@Param('filename') fileName: string) {
  //   const file = createReadStream(join(process.cwd(), `/uploads/video/output/${fileName}`));
  //   return new StreamableFile(file);
  // }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
