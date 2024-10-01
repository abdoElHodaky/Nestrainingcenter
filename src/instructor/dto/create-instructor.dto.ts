import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

import { 
  ApiProperty, 
  ApiPropertyOptional
} from '@nestjs/swagger';

import { Gender } from 'src/gender.enum';

export class CreateInstructorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty()
  lastName: string;

  @IsString()
  @Length(2)
  @IsNotEmpty()
  @ApiProperty()
  age: string;

  @IsNotEmpty()
  @ApiProperty()
  gender: Gender;

  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  address: string;

  @IsNotEmpty()
  @Length(8)
  @ApiProperty()
  CIN: string;

  @IsNotEmpty()
  @MaxLength(20)
  @IsPhoneNumber('EG')
  @ApiProperty()
  phoneNumber: string;

  @IsEmail()
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  highestEducationLevel: string;

  @IsNotEmpty()
  @ApiProperty()
  educationalInstitution: string;

  @IsNotEmpty()
  @ApiProperty()
  major: string;

  @IsNotEmpty()
  @ApiProperty()
  city: string;
}
