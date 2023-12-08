import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatorEditorChoiceDTO {
  @IsBoolean()
  @IsNotEmpty()
  editorChoice: boolean;
}
