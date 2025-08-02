import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class BookPropertyDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkInDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkOutDate: Date;
} 