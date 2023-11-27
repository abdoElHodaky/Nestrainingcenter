import { IsNotEmpty, IsNumber, IsDate, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  maxParticipants: number;

  @IsNotEmpty()
  @IsString()
  prerequisites: string;

  @IsNotEmpty()
  @IsNumber()
  registrationFee: number;

  @IsNotEmpty()
  @IsNumber()
  instructorSalary: number;

  @IsNotEmpty()
  @IsNumber()
  instructorId: number;
}
