import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SerieEditorChoiceDTO {
  @IsBoolean()
  @IsNotEmpty()
  editorChoice: boolean;
}
