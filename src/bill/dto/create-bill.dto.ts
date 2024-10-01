import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateBillDto {
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  type: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  sender: string;

  @IsString()
  @ApiProperty()
  receiver: string;

  @IsString()
  @ApiPropertyOptional()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  status: string;

  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  paymentMethod: string;

  @IsNotEmpty()
  @ApiProperty()
  date: Date;
}
