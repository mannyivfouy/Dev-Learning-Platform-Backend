import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity.js';
import { Plan } from '../../plans/entities/plan.entity.js';
import { Payment } from '../../payments/entities/payment.entity.js';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'uuid' })
  plan_id: string;

  @Column({
    type: 'enum',
    enum: ['stripe', 'paypal', 'bakong'],
  })
  provider: 'stripe' | 'paypal' | 'bakong';

  @Column({ type: 'varchar', length: 255, nullable: true })
  provider_customer_id: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  provider_subscription_id: string | null;

  @Column({
    type: 'enum',
    enum: ['pending', 'active', 'past_due', 'cancelled', 'expired'],
    default: 'pending',
  })
  status: 'pending' | 'active' | 'past_due' | 'cancelled' | 'expired';

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];
}
