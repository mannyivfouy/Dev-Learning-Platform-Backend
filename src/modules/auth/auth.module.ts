import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { StudentsModule } from '../students/students.module.js';

@Module({
  imports: [UsersModule, StudentsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
