import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto.js';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity.js';
import { Course } from '../courses/entities/course.entity.js';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const student = await this.studentRepository.findOne({
      where: { id: createEnrollmentDto.student_id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.courseRepository.findOne({
      where: { id: createEnrollmentDto.course_id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        student_id: createEnrollmentDto.student_id,
        course_id: createEnrollmentDto.course_id,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    const enrollment = await this.enrollmentRepository.create({
      ...createEnrollmentDto,
      enrolled_at: new Date(),
      expires_at: createEnrollmentDto.expires_at
        ? new Date(createEnrollmentDto.expires_at)
        : null,
    });

    return this.enrollmentRepository.save(enrollment);
  }

  async findAll() {
    return this.enrollmentRepository.find({
      relations: {
        student: true,
        course: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: {
        student: true,
        course: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.findOne(id);

    Object.assign(enrollment, {
      ...updateEnrollmentDto,
      ...(updateEnrollmentDto.expires_at !== undefined && {
        expires_at: updateEnrollmentDto.expires_at
          ? new Date(updateEnrollmentDto.expires_at)
          : null,
      }),
    });

    return this.enrollmentRepository.save(enrollment);
  }

  async remove(id: string) {
    const enrollment = await this.findOne(id);

    await this.enrollmentRepository.remove(enrollment);

    return {
      message: 'Enrollment deleted successfully',
    };
  }
}
