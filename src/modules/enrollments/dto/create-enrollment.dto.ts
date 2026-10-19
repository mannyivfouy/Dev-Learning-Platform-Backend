import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @IsIn(['purchase', 'subscription'])
  source: 'purchase' | 'subscription';

  @IsOptional()
  @IsDateString()
  expires_at?: Date
}
