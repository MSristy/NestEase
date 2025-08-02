import { IsString, IsUUID, IsOptional, IsBoolean, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryDetails {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsString()
  contactNumber: string;
}

export class CreateSwapRequestDto {
  @IsUUID()
  offeredItemId: string;

  @IsUUID()
  requestedItemId: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsBoolean()
  isDeliveryRequired: boolean;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryDetails)
  deliveryDetails?: DeliveryDetails;
} 