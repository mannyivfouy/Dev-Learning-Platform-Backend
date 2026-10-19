import { Module } from '@nestjs/common';
import { LessonProgressService } from './lesson_progress.service.js';
import { LessonProgressController } from './lesson_progress.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgress } from './entities/lesson_progress.entity.js';
import { Student } from '../students/entities/student.entity.js';
import { Lesson } from '../lessons/entities/lesson.entity.js';
import { Enrollment } from '../enrollments/entities/enrollment.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonProgress, Student, Lesson, Enrollment]),
  ],
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
  exports: [LessonProgressService],
})
export class LessonProgressModule {}
