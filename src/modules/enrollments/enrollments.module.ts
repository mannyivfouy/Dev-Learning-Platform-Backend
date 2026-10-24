import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service.js';
import { EnrollmentsController } from './enrollments.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity.js';
import { Student } from '../students/entities/student.entity.js';
import { Course } from '../courses/entities/course.entity.js';
import { Lesson } from '../lessons/entities/lesson.entity.js';
import { Subscription } from '../subscriptions/entities/subscription.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Student, Course, Lesson, Subscription])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
