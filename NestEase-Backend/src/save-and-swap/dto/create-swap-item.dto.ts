import { IsString, IsNumber, IsArray, Min, IsOptional } from 'class-validator';

export class CreateSwapItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNumber()
  @Min(0)
  estimatedValue: number;

  @IsString()
  condition: string;

  @IsArray()
  @IsString({ each: true })
  preferredSwapCategories: string[];

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsString()
  location: string;
} 