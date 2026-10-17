import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity.js';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity.js';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    if (createCourseDto.category_id) {
      const category = await this.categoryRepository.findOneBy({
        id: createCourseDto.category_id,
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createCourseDto.category_id} not found`,
        );
      }
    }

    const course = this.courseRepository.create(createCourseDto);

    return this.courseRepository.save(course);
  }

  findAll() {
    return this.courseRepository.find({
      relations: {
        category: true
      }
    });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);

    if (updateCourseDto.category_id) {
      const category = await this.categoryRepository.findOneBy({
        id: updateCourseDto.category_id,
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateCourseDto.category_id} not found`,
        );
      }
    }

    Object.assign(course, updateCourseDto);

    return this.courseRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.findOne(id);

    await this.courseRepository.remove(course);

    return {
      message: 'Course deleted successfully',
    };
  }
}
