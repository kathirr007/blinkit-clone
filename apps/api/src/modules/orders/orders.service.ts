import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { QueryOrderDto } from './dto/query-order.dto'
import { OrderStatus } from '@prisma/client'

const DELIVERY_FEE_THRESHOLD = 499
const DELIVERY_FEE = 25

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { inventory: true } },
            variant: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty')
    }

    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
    })
    if (!address) throw new NotFoundException('Address not found')

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new BadRequestException(`Product "${item.product.name}" is no longer available`)
      }
      const available = item.product.inventory
        ? item.product.inventory.stockQuantity - item.product.inventory.reservedQuantity
        : 0
      if (item.quantity > available) {
        throw new BadRequestException(
          `Insufficient stock for "${item.product.name}". Available: ${available}`,
        )
      }
    }

    const orderNumber = await this.generateOrderNumber()

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant ? Number(item.variant.price) : Number(item.product.price)
      return sum + price * item.quantity
    }, 0)

    const deliveryFee = subtotal >= DELIVERY_FEE_THRESHOLD ? 0 : DELIVERY_FEE
    const tax = 0
    const total = subtotal + deliveryFee - 0 + tax

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: dto.addressId,
          status: OrderStatus.PENDING,
          subtotal,
          deliveryFee,
          discount: 0,
          tax,
          total,
          deliverySlot: dto.deliverySlot || null,
          notes: dto.notes || null,
          items: {
            create: cart.items.map((item) => {
              const price = item.variant
                ? Number(item.variant.price)
                : Number(item.product.price)
              return {
                productId: item.productId,
                variantId: item.variantId,
                name: item.variant
                  ? `${item.product.name} - ${item.variant.name}`
                  : item.product.name,
                price,
                quantity: item.quantity,
                total: price * item.quantity,
              }
            }),
          },
          statusHistory: {
            create: {
              status: OrderStatus.PENDING,
              note: 'Order placed',
            },
          },
        },
        include: {
          items: true,
          address: true,
          statusHistory: { orderBy: { createdAt: 'asc' } },
        },
      })

      for (const item of cart.items) {
        if (item.product.inventory) {
          await tx.inventory.update({
            where: { id: item.product.inventory.id },
            data: { reservedQuantity: { increment: item.quantity } },
          })
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

      return newOrder
    })

    await this.redis.del(`cart:${userId}`)

    return order
  }

  async findAll(userId: string, query: QueryOrderDto) {
    const where: any = { userId }
    if (query.status) where.status = query.status

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: { take: 3 },
          payment: { select: { method: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.order.count({ where }),
    ])

    return {
      data: orders,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    }
  }

  async findAllAdmin(query: QueryOrderDto) {
    const where: any = {}
    if (query.status) where.status = query.status

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, phone: true } },
          items: true,
          payment: true,
          address: true,
          delivery: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.order.count({ where }),
    ])

    return {
      data: orders,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    }
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: true,
        address: true,
        payment: true,
        delivery: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!order) throw new NotFoundException('Order not found')
    return order
  }

  async findOneAdmin(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        items: true,
        address: true,
        payment: true,
        delivery: { include: { deliveryPartner: { select: { id: true, name: true, phone: true } } } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!order) throw new NotFoundException('Order not found')
    return order
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!order) throw new NotFoundException('Order not found')

    this.validateStatusTransition(order.status, dto.status)

    const updateData: any = { status: dto.status }

    if (dto.status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date()
    }
    if (dto.status === OrderStatus.CANCELLED) {
      updateData.cancelledAt = new Date()
      updateData.cancellationReason = dto.note || null
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: updateData,
      })

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status: dto.status,
          note: dto.note || null,
        },
      })

      if (dto.status === OrderStatus.DELIVERED || dto.status === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          const inventory = await tx.inventory.findFirst({
            where: { productId: item.productId },
          })
          if (inventory) {
            if (dto.status === OrderStatus.DELIVERED) {
              await tx.inventory.update({
                where: { id: inventory.id },
                data: {
                  stockQuantity: { decrement: item.quantity },
                  reservedQuantity: { decrement: item.quantity },
                },
              })
              await tx.inventoryLog.create({
                data: {
                  inventoryId: inventory.id,
                  change: -item.quantity,
                  reason: 'order_delivered',
                  referenceId: id,
                },
              })
            } else {
              await tx.inventory.update({
                where: { id: inventory.id },
                data: { reservedQuantity: { decrement: item.quantity } },
              })
              await tx.inventoryLog.create({
                data: {
                  inventoryId: inventory.id,
                  change: item.quantity,
                  reason: 'order_cancelled',
                  referenceId: id,
                },
              })
            }
          }
        }
      }

      return updatedOrder
    })

    return updated
  }

  async cancelOrder(userId: string, id: string, reason?: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
    })
    if (!order) throw new NotFoundException('Order not found')

    const cancellableStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
    ]
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage')
    }

    return this.updateStatus(id, {
      status: OrderStatus.CANCELLED,
      note: reason || 'Cancelled by customer',
    })
  }

  async getTrackingInfo(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        delivery: {
          include: {
            deliveryPartner: { select: { name: true, phone: true } },
          },
        },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!order) throw new NotFoundException('Order not found')

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      statusHistory: order.statusHistory,
      delivery: order.delivery
        ? {
            partnerName: order.delivery.deliveryPartner.name,
            partnerPhone: order.delivery.deliveryPartner.phone,
            status: order.delivery.status,
            currentLatitude: order.delivery.currentLatitude,
            currentLongitude: order.delivery.currentLongitude,
          }
        : null,
    }
  }

  private validateStatusTransition(current: OrderStatus, next: OrderStatus) {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
      [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.OUT_FOR_DELIVERY],
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    }

    if (!validTransitions[current]?.includes(next)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${next}`,
      )
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const key = `order:counter:${dateStr}`

    const count = await this.redis.get(key)
    const nextCount = count ? parseInt(count) + 1 : 1
    await this.redis.set(key, nextCount.toString(), 86400)

    return `BLK-${dateStr}-${nextCount.toString().padStart(5, '0')}`
  }
}
