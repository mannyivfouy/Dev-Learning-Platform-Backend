import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  studentLogin(@Body() loginDto: LoginDto) {
    return this.authService.studentLogin(loginDto);
  }

  @Post('admin/login')
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }
}
