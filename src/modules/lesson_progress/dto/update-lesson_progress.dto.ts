import { IsBoolean } from 'class-validator';

export class UpdateLessonProgressDto {
  @IsBoolean()
  is_complete: boolean;
}
