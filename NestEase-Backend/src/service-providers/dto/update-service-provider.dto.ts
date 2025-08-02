import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateServiceProviderDto {
  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  services?: string[];

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  contactNumber?: string;
} 