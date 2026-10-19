import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLessonProgressDto {
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @IsUUID()
  @IsNotEmpty()
  lesson_id: string;
}
