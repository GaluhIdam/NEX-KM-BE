import { Module } from '@nestjs/common';
import { AudioUploadService } from './services/audio-upload.service';
import { BullModule } from '@nestjs/bull';
import { AudioUploadProcessor } from './processor/audio-upload.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'podcast-upload',
    }),
  ],
  providers: [AudioUploadService, AudioUploadProcessor]
})
export class AudioUploadModule { }
