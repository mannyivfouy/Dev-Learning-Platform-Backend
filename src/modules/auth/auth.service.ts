import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { StudentsService } from '../students/students.service.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly studentService: StudentsService,
  ) {}

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    const isEmail = identifier.includes('@');

    // Username can ONLY belong to User (admin/staff)
    if (!isEmail) {
      const user = await this.userService.findByIdentifier(identifier);

      if (!user) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      return {
        account_type: 'user',
        account: user,
      };
    }

    // Email: check User
    const user = await this.userService.findByIdentifier(identifier);

    if (user) {
      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      return {
        account_type: 'user',
        account: user,
      };
    }

    // Email: check Student
    const student = await this.studentService.findByEmail(identifier);

    if (student) {
      const passwordMatched = await bcrypt.compare(password, student.password);

      if (!passwordMatched) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      return {
        account_type: 'student',
        account: student,
      };
    }

    throw new UnauthorizedException('Invalid Credentials');
  }
}
