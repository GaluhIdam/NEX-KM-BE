import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as ffmpeg from 'fluent-ffmpeg';
import { JobInterface } from '../interfaces/job.interface';
import { AudioUploadService } from '../services/audio-upload.service';

@Processor('podcast-upload')
export class AudioUploadProcessor {
    private readonly logger = new Logger(AudioUploadProcessor.name);

    constructor(private readonly audioUploadService: AudioUploadService) {

    }
    @Process('transcode')
    async handleTranscode(job: Job<JobInterface>) {
        this.logger.debug('Start transcoding...');
        this.logger.debug(job.data);
        await this.audioUploadService.processFile(job.data.inputPath, job.data.outputPath);
        this.logger.debug('Transcoding completed');
    }

}