import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PodcastColaboratorDTO {
    @IsNotEmpty()
    @IsNumber()
    podcastId: number;

    @IsNotEmpty()
    @IsString()
    personalNumber: string;
}
