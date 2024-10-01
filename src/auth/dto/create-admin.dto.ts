import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { 
  ApiProperty, 
  ApiPropertyOptional 
} from '@nestjs/swagger';


export class CreateAdminDto {
  
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty()
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty()
  lastName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsString()
  @Length(2)
  @IsNotEmpty()
  @ApiProperty()
  age: string;

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

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @ApiProperty()
  password: string;
}
