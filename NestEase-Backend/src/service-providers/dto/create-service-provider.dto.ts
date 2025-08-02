import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateServiceProviderDto {
  @IsString()
  businessName: string;

  @IsString()
  serviceType: string;

  @IsString()
  description: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsString()
  services: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  ownerId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
} 