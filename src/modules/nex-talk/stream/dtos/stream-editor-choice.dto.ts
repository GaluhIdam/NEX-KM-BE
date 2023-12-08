import { IsBoolean, IsNotEmpty } from 'class-validator';

export class StreamEditorChoiceDTO {
  @IsBoolean()
  @IsNotEmpty()
  editorChoice: boolean;
}
