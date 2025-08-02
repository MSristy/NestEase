import { IsString, IsNumber, IsArray, Min, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { PropertyType, PropertyStatus } from '../property.entity';

export class CreatePropertyDto {
  @IsString()
  yourName: string;

  @IsString()
  yourPhone: string;

  @IsEmail()
  yourEmail: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  location: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsNumber()
  @Min(0)
  bedrooms: number;

  @IsNumber()
  @Min(0)
  bathrooms: number;

  @IsNumber()
  @Min(0)
  squareFeet: number;

  @IsEnum(PropertyType)
  type: PropertyType;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  bachelorFriendly?: boolean;
} 