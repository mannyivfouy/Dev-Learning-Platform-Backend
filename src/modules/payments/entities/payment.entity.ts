import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ManyToOne } from 'typeorm/browser';
import { Student } from '../../students/entities/student.entity.js';
import { Subscription } from '../../subscriptions/entities/subscription.entity.js';
import { Enrollment } from '../../enrollments/entities/enrollment.entity.js';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'uuid', nullable: true })
  subscription_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  enrollment_id: string | null;

  @Column({
    type: 'enum',
    enum: ['stripe', 'paypal', 'bakong'],
  })
  provider: 'stripe' | 'paypal' | 'bakong';

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
  })
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @ManyToOne(() => Enrollment)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;
}
