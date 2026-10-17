import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string;
}