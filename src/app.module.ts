import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './modules/roles/roles.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { StudentsModule } from './modules/students/students.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { CoursesModule } from './modules/courses/courses.module.js';
import { LessonsModule } from './modules/lessons/lessons.module.js';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module.js';
import { LessonProgressModule } from './modules/lesson_progress/lesson_progress.module.js';
import { PlansModule } from './modules/plans/plans.module.js';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import appConfig from './config/app.config.js';
import databaseConfig from './config/database.config.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module.js';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: databaseConfig().database.host,
      port: databaseConfig().database.port,
      username: databaseConfig().database.username,
      password: databaseConfig().database.password,
      database: databaseConfig().database.name,

      autoLoadEntities: true,

      synchronize: false,
    }),
    UsersModule,
    RolesModule,
    StudentsModule,
    CategoriesModule,
    CoursesModule,
    LessonsModule,
    LessonProgressModule,
    EnrollmentsModule,
    PlansModule,
    SubscriptionsModule,
    PaymentsModule,
    AuthModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
