import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service.js';
import { CoursesController } from './courses.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity.js';
import { Category } from '../categories/entities/category.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Category])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService]
})
export class CoursesModule {}
