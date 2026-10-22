import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service.js';
import { LessonsController } from './lessons.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity.js';
import { Course } from '../courses/entities/course.entity.js';
import { EnrollmentsModule } from '../enrollments/enrollments.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Course]), EnrollmentsModule],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
