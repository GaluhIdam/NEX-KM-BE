import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PodcastEditorChoiceDTO {
  @IsBoolean()
  @IsNotEmpty()
  editorChoice: boolean;
}
