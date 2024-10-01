import { IsNotEmpty, IsNumber, IsDate, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  category: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  duration: string;

  @IsNotEmpty()
  @ApiProperty()
  startDate: string;

  @IsNotEmpty()
  @ApiProperty()
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  maxParticipants: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  prerequisites: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  registrationFee: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  instructorSalary: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  instructorId: number;
}
