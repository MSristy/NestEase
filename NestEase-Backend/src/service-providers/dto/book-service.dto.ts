import { IsString, IsDate, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class BookServiceDto {
  @IsString()
  serviceType: string;

  @Type(() => Date)
  @IsDate()
  serviceDate: Date;

  @IsString()
  serviceTime: string;

  @IsNumber()
  duration: number;

  @IsArray()
  @IsString({ each: true })
  requestedServices: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  address: string;
} 