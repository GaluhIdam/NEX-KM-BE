import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
export class VideoUploadService {
    //File Process Transcode
    async processFile(inputPath: string, outputPath: string) {
        return new Promise<void>((resolve, reject) => {
            ffmpeg(inputPath, { timeout: 432000 })
                .addOptions([
                    '-profile:v baseline',
                    '-level 3.0',
                    '-start_number 0',
                    '-hls_time 6',
                    '-hls_list_size 0',
                    '-s 854x480',
                    '-f hls',
                ])
                .output(`${outputPath}/transcodeMP4.m3u8`)
                .on('end', () => {
                    console.log('Video processing complete');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error processing video:', err);
                    reject(err);
                })
                .run();
        });
    }
}
