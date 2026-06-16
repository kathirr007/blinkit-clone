import { IsString, IsNotEmpty, IsIn } from 'class-validator'

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string

  @IsString()
  @IsNotEmpty()
  transactionId: string

  @IsIn(['success', 'failed'])
  status: 'success' | 'failed'
}
