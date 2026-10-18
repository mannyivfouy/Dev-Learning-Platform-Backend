import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { StudentsService } from '../students/students.service.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly studentService: StudentsService,
    private readonly jwtService: JwtService,
  ) {}

  async studentLogin(loginDto: LoginDto) {
    const student = await this.studentService.findByIdentifier(
      loginDto.identifier,
    );

    if (!student) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      student.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = {
      sub: student.id,
      account_type: 'student',
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const { password, ...studentData } = student;

    return {
      access_token: accessToken,
      account: studentData,
    };
  }

  async adminLogin(loginDto: LoginDto) {
    const user = await this.userService.findByIdentifier(loginDto.identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = {
      sub: user.id,
      account_type: 'user',
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const { password, ...userData } = user;

    return {
      access_token: accessToken,
      account: userData,
    };
  }
}
