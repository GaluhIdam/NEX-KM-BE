import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ForumEditorChoiceDTO {
  @IsBoolean()
  @IsNotEmpty()
  editorChoice: boolean;
}
