import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { NotificationsGateway } from './notifications.gateway'

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ])

    return {
      data: notifications,
      unreadCount,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async markAsRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    })
    return { message: 'Marked as read' }
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
    return { message: 'All notifications marked as read' }
  }

  async createAndNotify(userId: string, data: { title: string, body: string, type: string, data?: any }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title: data.title,
        body: data.body,
        type: data.type,
        data: data.data || null,
      },
    })

    this.gateway.sendToUser(userId, 'notification:new', notification)
    return notification
  }

  async notifyOrderStatusChange(userId: string, orderId: string, status: string, orderNumber: string) {
    const statusMessages: Record<string, string> = {
      CONFIRMED: 'Your order has been confirmed',
      PREPARING: 'Your order is being prepared',
      READY_FOR_PICKUP: 'Your order is ready for pickup',
      OUT_FOR_DELIVERY: 'Your order is out for delivery',
      DELIVERED: 'Your order has been delivered',
      CANCELLED: 'Your order has been cancelled',
    }

    const body = statusMessages[status] || `Order status updated to ${status}`

    return this.createAndNotify(userId, {
      title: `Order ${orderNumber}`,
      body,
      type: 'order_update',
      data: { orderId, status },
    })
  }
}
