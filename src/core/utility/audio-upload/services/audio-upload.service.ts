import { Injectable } from '@nestjs/common';

import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
export class AudioUploadService {
    //Process File
    async processFile(inputPath: string, outputPath: string) {
        return new Promise<void>((resolve, reject) => {
            ffmpeg(inputPath, { timeout: 432000 })
                .addOptions([
                    '-profile:v baseline',
                    '-level 3.0',
                    '-start_number 0',
                    '-hls_time 6',
                    '-hls_list_size 0',
                    '-f hls',
                ])
                .output(`${outputPath}/transcodeMP3.m3u8`)
                .on('end', () => {
                    console.log('Audio processing complete');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error processing audio:', err);
                    reject(err);
                })
                .run();
        });
    }
}
