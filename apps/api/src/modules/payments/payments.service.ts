import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreatePaymentDto } from './dto/create-payment.dto'

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async initiatePayment(userId: string, dto: CreatePaymentDto) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId, status: OrderStatus.PENDING },
      include: { payment: true },
    })

    if (!order) throw new NotFoundException('Order not found or not in pending state')
    if (order.payment) throw new BadRequestException('Payment already exists for this order')

    if (dto.method === PaymentMethod.COD) {
      const payment = await this.prisma.payment.create({
        data: {
          orderId: order.id,
          method: PaymentMethod.COD,
          status: PaymentStatus.PENDING,
          amount: order.total,
        },
      })

      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CONFIRMED },
      })

      await this.prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: OrderStatus.CONFIRMED,
          note: 'Payment method: Cash on Delivery',
        },
      })

      return {
        paymentId: payment.id,
        method: payment.method,
        status: payment.status,
        message: 'Order confirmed with Cash on Delivery',
      }
    }

    // For online payments (UPI, Card, Net Banking)
    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        method: dto.method,
        status: PaymentStatus.PENDING,
        amount: order.total,
      },
    })

    // In production, this would call Razorpay/Stripe to create a payment order
    // For now, return a mock gateway response
    const gatewayOrderId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    return {
      paymentId: payment.id,
      gatewayOrderId,
      amount: Number(order.total),
      currency: 'INR',
      method: dto.method,
      // In production: key_id, callback_url, etc.
    }
  }

  async verifyPayment(dto: { paymentId: string, transactionId: string, status: 'success' | 'failed' }) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
      include: { order: true },
    })

    if (!payment) throw new NotFoundException('Payment not found')

    if (dto.status === 'success') {
      await this.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.COMPLETED,
            transactionId: dto.transactionId,
            paidAt: new Date(),
            gatewayResponse: { transactionId: dto.transactionId, status: 'success' },
          },
        })

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.CONFIRMED },
        })

        await tx.orderStatusHistory.create({
          data: {
            orderId: payment.orderId,
            status: OrderStatus.CONFIRMED,
            note: `Payment completed via ${payment.method}`,
          },
        })
      })

      return { status: 'success', message: 'Payment verified and order confirmed' }
    }
    else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          gatewayResponse: { transactionId: dto.transactionId, status: 'failed' },
        },
      })

      return { status: 'failed', message: 'Payment failed' }
    }
  }

  async getPaymentStatus(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { payment: true },
    })

    if (!order) throw new NotFoundException('Order not found')
    if (!order.payment) throw new NotFoundException('Payment not found for this order')

    return {
      paymentId: order.payment.id,
      method: order.payment.method,
      status: order.payment.status,
      amount: Number(order.payment.amount),
      transactionId: order.payment.transactionId,
      paidAt: order.payment.paidAt,
    }
  }
}
