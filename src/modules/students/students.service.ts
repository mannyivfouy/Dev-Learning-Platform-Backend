import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity.js';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    const student = this.studentRepository.create({
      ...createStudentDto,
      password: hashedPassword,
    });

    return this.studentRepository.save(student);
  }

  findAll() {
    return this.studentRepository.find();
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(id);

    if (updateStudentDto.password) {
      updateStudentDto.password = await bcrypt.hash(
        updateStudentDto.password,
        10,
      );
    }

    Object.assign(student, updateStudentDto);

    return this.studentRepository.save(student);
  }

  async remove(id: string) {
    const student = await this.findOne(id);

    await this.studentRepository.remove(student);

    return {
      message: 'Student deleted Successfully',
    };
  }

  async findByEmail(email: string) {
    return this.studentRepository.findOne({
      where: { email },
    });
  }
}
