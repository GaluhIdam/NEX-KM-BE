import { IsBoolean, IsNotEmpty } from 'class-validator';

export class EbookEditorChoiceDTO {
  @IsBoolean()
  @IsNotEmpty()
  editor_choice: boolean;
}
