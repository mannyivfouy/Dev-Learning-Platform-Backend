import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity.js';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity.js';
import { Enrollment } from '../enrollments/entities/enrollment.entity.js';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  async createCourseCheckout(courseId: string, studentId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'usd',

            product_data: {
              name: course.title,
            },

            unit_amount: Math.round(Number(course.price) * 100),
          },

          quantity: 1,
        },
      ],

      metadata: {
        course_id: course.id,
        student_id: studentId,
      },

      success_url: 'http://localhost:4200/courses',

      cancel_url: 'http://localhost:4200/payment/cancel',
    });
    console.log('Stripe Checkout Session:', session.id);
    console.log('Stripe Checkout Metadata:', session.metadata);
    console.log('Stripe Success URL:', session.success_url);

    return {
      checkout_url: session.url,
    };
  }

  // CHANGED
  async handleWebhook(req: any) {
    console.log('WEBHOOK HIT, rawBody exists:', !!req.rawBody);
    const signature = req.headers['stripe-signature'];

    const event = this.stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    console.log('Stripe webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const studentId = session.metadata?.student_id;
      const courseId = session.metadata?.course_id;

      if (!studentId || !courseId) {
        throw new Error('Missing student_id or course_id in Stripe metadata');
      }

      // Check whether this payment was already processed
      const transactionId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null;

      if (transactionId) {
        const existingPayment = await this.paymentRepository.findOne({
          where: {
            transaction_id: transactionId,
          },
        });

        if (existingPayment) {
          return {
            received: true,
            message: 'Payment already processed',
          };
        }
      }

      // Find the course
      const course = await this.courseRepository.findOne({
        where: {
          id: courseId,
        },
      });

      if (!course) {
        throw new Error('Course not found');
      }

      // Create payment record
      const payment = this.paymentRepository.create({
        student_id: studentId,
        subscription_id: null,
        enrollment_id: null,
        provider: 'stripe',
        transaction_id: transactionId,
        amount: (session.amount_total ?? 0) / 100,
        currency: (session.currency ?? 'usd').toUpperCase(),
        status: 'paid',
        paid_at: new Date(),
      });

      await this.paymentRepository.save(payment);

      // Create enrollment
      const enrollment = this.enrollmentRepository.create({
        student_id: studentId,
        course_id: courseId,
        source: 'purchase',
        status: 'active',
        enrolled_at: new Date(),
        expires_at: null,
      });

      await this.enrollmentRepository.save(enrollment);

      // Connect payment to enrollment
      payment.enrollment_id = enrollment.id;

      await this.paymentRepository.save(payment);

      console.log(
        `Payment ${payment.id} created and student ${studentId} enrolled in course ${courseId}`,
      );
    }

    return {
      received: true,
    };
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
