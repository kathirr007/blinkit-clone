import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

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
