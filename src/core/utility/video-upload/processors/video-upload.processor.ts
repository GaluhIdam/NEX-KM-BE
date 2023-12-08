import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as ffmpeg from 'fluent-ffmpeg';
import { JobInterface } from '../interfaces/job.interface';
import { VideoUploadService } from '../services/video-upload.service';

@Processor('video-upload')
export class VideoUploadProcessor {
    private readonly logger = new Logger(VideoUploadProcessor.name);

    constructor(private readonly videoUploadService: VideoUploadService) { }

    @Process('transcode')
    async handleTranscode(job: Job<JobInterface>) {
        try {
            this.logger.debug('Start video transcoding...');
            this.logger.debug(job.data);
            this.logger.debug(job.processedOn);
            this.logger.debug(job.attemptsMade);
            await this.videoUploadService.processFile(job.data.inputPath, job.data.outputPath);
            this.logger.debug('Video transcoding completed');
        } catch (error) {
            this.logger.error('Transcoding failed', error);
            throw error;
        }
    }
}
