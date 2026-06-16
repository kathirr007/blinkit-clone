import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator'

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string

  @IsString()
  @IsOptional()
  variantId?: string

  @IsInt()
  @Min(1)
  quantity: number = 1
}
