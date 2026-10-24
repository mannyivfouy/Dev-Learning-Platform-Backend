import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity.js';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity.js';
import { Enrollment } from '../enrollments/entities/enrollment.entity.js';
import { Plan } from '../plans/entities/plan.entity.js';
import { Student } from '../students/entities/student.entity.js';
import { Subscription } from '../subscriptions/entities/subscription.entity.js';

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

    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,

    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
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

      // NEW: Handle subscription checkout
      if (session.mode === 'subscription') {
        const studentId = session.metadata?.student_id;
        const planId = session.metadata?.plan_id;

        if (!studentId || !planId) {
          throw new Error(
            'Missing student_id or plan_id in subscription metadata',
          );
        }

        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : null;

        const customerId =
          typeof session.customer === 'string' ? session.customer : null;

        if (!subscriptionId || !customerId) {
          throw new Error('Missing Stripe subscription or customer ID');
        }

        // NEW: Get the subscription details from Stripe
        const stripeSubscription =
          await this.stripe.subscriptions.retrieve(subscriptionId);

        const plan = await this.planRepository.findOne({
          where: {
            id: planId,
          },
        });

        if (!plan) {
          throw new Error('Subscription plan not found');
        }

        const subscriptionItem = stripeSubscription.items.data[0];

        if (!subscriptionItem) {
          throw new Error('Stripe subscription item not found');
        }

        const subscription = this.subscriptionRepository.create({
          student_id: studentId,
          plan_id: plan.id,
          provider: 'stripe',
          provider_customer_id: customerId,
          provider_subscription_id: stripeSubscription.id,
          status: 'active',
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          start_date: new Date(stripeSubscription.start_date * 1000),
          end_date: new Date(subscriptionItem.current_period_end * 1000),
        });

        await this.subscriptionRepository.save(subscription);

        console.log('Stripe subscription:', stripeSubscription.id);

        console.log(
          `Subscription checkout completed: student ${studentId}, subscription ${subscriptionId}`,
        );

        return {
          received: true,
        };
      }

      // EXISTING: Handle individual course purchase
      if (session.mode === 'payment') {
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
    }
    
    if (event.type === 'invoice.paid') {
      const invoice = event.data.object;

      console.log('Subscription invoice paid:', invoice.id);

      const stripeSubscriptionId =
        typeof invoice.parent?.subscription_details?.subscription === 'string'
          ? invoice.parent.subscription_details.subscription
          : null;

      if (!stripeSubscriptionId) {
        console.log('Invoice is not associated with a subscription');

        return {
          received: true,
        };
      }

      const subscription = await this.subscriptionRepository.findOne({
        where: {
          provider_subscription_id: stripeSubscriptionId,
        },
      });

      if (!subscription) {
        throw new Error('Local subscription not found');
      }

      // Prevent duplicate webhook processing
      const existingPayment = await this.paymentRepository.findOne({
        where: {
          transaction_id: invoice.id,
        },
      });

      if (existingPayment) {
        return {
          received: true,
          message: 'Subscription payment already processed',
        };
      }

      const payment = this.paymentRepository.create({
        student_id: subscription.student_id,
        subscription_id: subscription.id,
        enrollment_id: null,
        provider: 'stripe',
        transaction_id: invoice.id,
        amount: (invoice.amount_paid ?? 0) / 100,
        currency: (invoice.currency ?? 'usd').toUpperCase(),
        status: 'paid',
        paid_at: new Date(),
      });

      await this.paymentRepository.save(payment);

      console.log(
        `Subscription payment ${payment.id} created for subscription ${subscription.id}`,
      );
    }

    return {
      received: true,
    };
  }

  // NEW
  async cancelSubscription(studentId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        student_id: studentId,
        status: 'active',
      },
    });

    if (!subscription) {
      throw new NotFoundException('Active subscription not found');
    }

    if (!subscription.provider_subscription_id) {
      throw new Error('Stripe subscription ID not found');
    }

    if (subscription.cancel_at_period_end) {
      return {
        message: 'Subscription is already scheduled for cancellation',
        end_date: subscription.end_date,
      };
    }

    // Tell Stripe to cancel at the end of the current billing period
    const stripeSubscription = await this.stripe.subscriptions.update(
      subscription.provider_subscription_id,
      {
        cancel_at_period_end: true,
      },
    );

    // Update our database
    subscription.cancel_at_period_end = stripeSubscription.cancel_at_period_end;

    await this.subscriptionRepository.save(subscription);

    return {
      message:
        'Subscription will be cancelled at the end of the billing period',
      end_date: subscription.end_date,
    };
  }

  async createSubscriptionCheckout(studentId: string) {
    const plan = await this.planRepository.findOne({
      where: {
        name: 'Premium Access',
        status: 'active',
      },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',

      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],

      metadata: {
        student_id: studentId,
        plan_id: plan.id,
      },

      success_url: 'http://localhost:4200/courses',

      cancel_url: 'http://localhost:4200/subscription/cancel',
    });

    return {
      checkout_url: session.url,
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
