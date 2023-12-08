import { Module } from '@nestjs/common';
import { VideoUploadService } from './services/video-upload.service';
import { BullModule } from '@nestjs/bull';
import { VideoUploadProcessor } from './processors/video-upload.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'video-upload',
        }),
    ],
    providers: [
        VideoUploadService,
        VideoUploadProcessor
    ]
})
export class VideoUploadModule { }
