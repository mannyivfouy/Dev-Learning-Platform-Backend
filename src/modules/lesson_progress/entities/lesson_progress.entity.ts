import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity.js';
import { Lesson } from '../../lessons/entities/lesson.entity.js';

@Entity('lesson_progress')
export class LessonProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'uuid' })
  lesson_id: string;

  @Column({ type: 'boolean', default: false })
  is_complete: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Lesson, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
