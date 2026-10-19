import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonProgressDto } from './dto/create-lesson_progress.dto.js';
import { UpdateLessonProgressDto } from './dto/update-lesson_progress.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonProgress } from './entities/lesson_progress.entity.js';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity.js';
import { Lesson } from '../lessons/entities/lesson.entity.js';
import { Enrollment } from '../enrollments/entities/enrollment.entity.js';

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createLessonProgressDto: CreateLessonProgressDto) {
    const student = await this.studentRepository.findOne({
      where: { id: createLessonProgressDto.student_id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const lesson = await this.lessonRepository.findOne({
      where: { id: createLessonProgressDto.lesson_id },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        student_id: createLessonProgressDto.student_id,
        course_id: lesson.course_id,
        status: 'active',
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('Student is not enrolled in this course');
    }

    const existingProgress = await this.lessonProgressRepository.findOne({
      where: {
        student_id: createLessonProgressDto.student_id,
        lesson_id: createLessonProgressDto.lesson_id,
      },
    });

    if (existingProgress) {
      throw new ConflictException('Lesson progress already exists');
    }

    const lessonProgress = this.lessonProgressRepository.create({
      student_id: createLessonProgressDto.student_id,
      lesson_id: createLessonProgressDto.lesson_id,
    });

    return this.lessonProgressRepository.save(lessonProgress);
  }

  async findAll() {
    return this.lessonProgressRepository.find({
      where: {
        student: true,
        lesson: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const lessonProgress = await this.lessonProgressRepository.findOne({
      where: { id },
      relations: {
        student: true,
        lesson: true,
      },
    });

    if (!lessonProgress) {
      throw new NotFoundException('Lesson progress not found');
    }

    return lessonProgress;
  }

  async update(id: string, updateLessonProgressDto: UpdateLessonProgressDto) {
    const lessonProgress = await this.findOne(id);

    lessonProgress.is_complete = updateLessonProgressDto.is_complete;

    lessonProgress.completed_at = updateLessonProgressDto.is_complete
      ? new Date()
      : null;

    return this.lessonProgressRepository.save(lessonProgress);
  }

  async remove(id: string) {
    const lessonProgress = await this.findOne(id);

    await this.lessonProgressRepository.remove(lessonProgress);

    return {
      message: 'Lesson progress deleted successfully',
    };
  }
}
