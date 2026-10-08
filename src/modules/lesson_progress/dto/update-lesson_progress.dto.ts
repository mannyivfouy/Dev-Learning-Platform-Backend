import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonProgressDto } from './create-lesson_progress.dto.js';

export class UpdateLessonProgressDto extends PartialType(CreateLessonProgressDto) {}
