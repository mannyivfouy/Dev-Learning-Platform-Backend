import { Module } from '@nestjs/common';
import { LessonProgressService } from './lesson_progress.service.js';
import { LessonProgressController } from './lesson_progress.controller.js';

@Module({
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
})
export class LessonProgressModule {}
