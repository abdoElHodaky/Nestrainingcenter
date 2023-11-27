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
import { Gender } from 'src/gender.enum';

export class CreateInstructorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  lastName: string;

  @IsString()
  @Length(2)
  @IsNotEmpty()
  age: string;

  @IsNotEmpty()
  gender: Gender;

  @IsNotEmpty()
  @MaxLength(50)
  address: string;

  @IsNotEmpty()
  @Length(8)
  CIN: string;

  @IsNotEmpty()
  @MaxLength(20)
  @IsPhoneNumber('TN')
  phoneNumber: string;

  @IsEmail()
  @MaxLength(50)
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  highestEducationLevel: string;

  @IsNotEmpty()
  educationalInstitution: string;

  @IsNotEmpty()
  major: string;

  @IsNotEmpty()
  city: string;
}
