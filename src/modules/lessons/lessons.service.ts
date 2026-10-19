import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { Not, Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity.js';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    const course = await this.courseRepository.findOne({
      where: { id: createLessonDto.course_id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existingOrder = await this.lessonRepository.findOne({
      where: {
        course_id: createLessonDto.course_id,
        lesson_order: createLessonDto.lesson_order,
      },
    });

    if (existingOrder) {
      throw new ConflictException('Lesson order already exists in this course');
    }

    const existingSlug = await this.lessonRepository.findOne({
      where: {
        course_id: createLessonDto.course_id,
        slug: createLessonDto.slug,
      },
    });

    if (existingSlug) {
      throw new ConflictException('Lesson slug already exists in this course');
    }

    const lesson = this.lessonRepository.create(createLessonDto);

    return this.lessonRepository.save(lesson);
  }

  async findAll() {
    return this.lessonRepository.find({
      relations: {
        course: true,
      },
      order: {
        lesson_order: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: {
        course: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.findOne(id);

    const courseId = updateLessonDto.course_id ?? lesson.course_id;

    if (updateLessonDto.course_id) {
      const course = await this.courseRepository.findOne({
        where: { id: updateLessonDto.course_id },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }

    if (updateLessonDto.lesson_order !== undefined) {
      const existingOrder = await this.lessonRepository.findOne({
        where: {
          course_id: courseId,
          lesson_order: updateLessonDto.lesson_order,
          id: Not(id),
        },
      });

      if (existingOrder) {
        throw new ConflictException(
          'Lesson order already exists in this course',
        );
      }
    }

    if (updateLessonDto.slug !== undefined) {
      const existingSlug = await this.lessonRepository.findOne({
        where: {
          course_id: courseId,
          slug: updateLessonDto.slug,
          id: Not(id),
        },
      });

      if (existingSlug) {
        throw new ConflictException(
          'Lesson slug already exists in this course',
        );
      }
    }

    Object.assign(lesson, updateLessonDto);

    return this.lessonRepository.save(lesson);
  }

  async remove(id: string) {
    const lesson = await this.findOne(id);

    await this.lessonRepository.remove(lesson);

    return {
      message: 'Lesson deleted successfully',
    };
  }
}
