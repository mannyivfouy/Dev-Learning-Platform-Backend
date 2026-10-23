import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity.js';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service.js';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    private readonly cloudinaryService: CloudinaryService,
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

  async findMe(studentId: string) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async updateProfile(studentId: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(studentId);

    if (updateStudentDto.password) {
      updateStudentDto.password = await bcrypt.hash(
        updateStudentDto.password,
        10,
      );
    }

    Object.assign(student, updateStudentDto);

    return this.studentRepository.save(student);
  }

  async updateAvatar(studentId: string, file: { buffer: Buffer }) {
    const student = await this.findOne(studentId);

    const result = await this.cloudinaryService.uploadImage(file, 'avatars');

    const uploadResult = result as {
      secure_url: string;
    };

    student.avatar = uploadResult.secure_url;

    return this.studentRepository.save(student);
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

  async findByIdentifier(identifier: string) {
    return this.studentRepository.findOne({
      where: [{ username: identifier }, { email: identifier }],
    });
  }

  async findByUsername(username: string) {
    return this.studentRepository.findOne({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.studentRepository.findOne({
      where: { email },
    });
  }

  async findByPhone(phone: string) {
    return this.studentRepository.findOne({
      where: { phone },
    });
  }
}
