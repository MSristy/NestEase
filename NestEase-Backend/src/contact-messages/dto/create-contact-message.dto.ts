import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateContactMessageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  message: string;
} 