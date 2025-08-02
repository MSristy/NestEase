import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ReplyContactMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  reply: string;
} 