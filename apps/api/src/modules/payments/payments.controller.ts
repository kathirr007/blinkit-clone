import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { VerifyPaymentDto } from './dto/verify-payment.dto'
import { PaymentsService } from './payments.service'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  initiate(@CurrentUser('id') userId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.initiatePayment(userId, dto)
  }

  @Post('verify')
  @Public()
  verify(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto)
  }

  @Get(':orderId')
  getStatus(@CurrentUser('id') userId: string, @Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentStatus(userId, orderId)
  }
}
