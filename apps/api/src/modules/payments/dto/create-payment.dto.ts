import { PaymentMethod } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string

  @IsEnum(PaymentMethod)
  method: PaymentMethod
}
