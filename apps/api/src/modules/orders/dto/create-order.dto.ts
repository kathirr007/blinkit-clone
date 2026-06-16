import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  addressId: string

  @IsString()
  @IsOptional()
  deliverySlot?: string

  @IsString()
  @IsOptional()
  notes?: string

  @IsString()
  @IsOptional()
  couponCode?: string
}
