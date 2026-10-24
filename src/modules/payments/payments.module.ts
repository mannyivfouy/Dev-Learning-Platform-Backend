import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity.js';
import { Course } from '../courses/entities/course.entity.js';
import { Subscription } from '../subscriptions/entities/subscription.entity.js';
import { Enrollment } from '../enrollments/entities/enrollment.entity.js';
import { Plan } from '../plans/entities/plan.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Course,
      Enrollment,
      Plan,
      Subscription
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
