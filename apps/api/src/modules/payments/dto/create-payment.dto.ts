import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { PaymentMethod } from '@prisma/client'

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string

  @IsEnum(PaymentMethod)
  method: PaymentMethod
}
