import { Module } from '@nestjs/common';
import { GetFileController } from './controllers/get-file.controller';

@Module({
  controllers: [GetFileController]
})
export class GetFileModule {}
