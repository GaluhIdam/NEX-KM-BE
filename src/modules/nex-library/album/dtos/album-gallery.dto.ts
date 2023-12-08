import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AlbumGalleryDTO {

  @IsNotEmpty()
  @IsNumber()
  albumId: number

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  images: string

  @IsNotEmpty()
  @IsString()
  path: string

  @IsNotEmpty()
  @IsNumber()
  size: number

  @IsNotEmpty()
  @IsString()
  mimeType: string

  @IsString()
  @IsNotEmpty()
  personalNumber: string
}