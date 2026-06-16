import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { NotificationsGateway } from '../notifications/notifications.gateway'
import { OrderStatus, UserRole } from '@prisma/client'
import { AssignDeliveryDto } from './dto/assign-delivery.dto'
import { UpdateLocationDto } from './dto/update-location.dto'

@Injectable()
export class DeliveryService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async getPartners() {
    return this.prisma.user.findMany({
      where: { role: UserRole.DELIVERY_PARTNER },
      select: {
        id: true,
        name: true,
        phone: true,
        deliveryAssignments: {
          where: { status: { in: ['assigned', 'picked_up', 'in_transit'] } },
          select: { id: true, orderId: true, status: true },
        },
      },
    })
  }

  async assignPartner(dto: AssignDeliveryDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { delivery: true },
    })

    if (!order) throw new NotFoundException('Order not found')
    if (order.delivery) throw new BadRequestException('Order already has a delivery partner assigned')

    const allowedStatuses: OrderStatus[] = [
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.READY_FOR_PICKUP,
    ]
    if (!allowedStatuses.includes(order.status)) {
      throw new BadRequestException('Order is not in a deliverable state')
    }

    const partner = await this.prisma.user.findFirst({
      where: { id: dto.deliveryPartnerId, role: UserRole.DELIVERY_PARTNER },
    })
    if (!partner) throw new NotFoundException('Delivery partner not found')

    return this.prisma.deliveryAssignment.create({
      data: {
        orderId: dto.orderId,
        deliveryPartnerId: dto.deliveryPartnerId,
        status: 'assigned',
      },
      include: {
        order: { select: { orderNumber: true, status: true } },
        deliveryPartner: { select: { name: true, phone: true } },
      },
    })
  }

  async updateLocation(userId: string, dto: UpdateLocationDto) {
    const assignment = await this.prisma.deliveryAssignment.findFirst({
      where: {
        deliveryPartnerId: userId,
        status: { in: ['assigned', 'picked_up', 'in_transit'] },
        orderId: dto.orderId,
      },
    })

    if (!assignment) throw new NotFoundException('Active delivery assignment not found')

    await this.prisma.deliveryAssignment.update({
      where: { id: assignment.id },
      data: {
        currentLatitude: dto.latitude,
        currentLongitude: dto.longitude,
        status: 'in_transit',
      },
    })

    this.notificationsGateway.broadcastDeliveryLocation(dto.orderId, {
      latitude: dto.latitude,
      longitude: dto.longitude,
    })

    return { message: 'Location updated' }
  }

  async getActiveDeliveries(userId: string) {
    return this.prisma.deliveryAssignment.findMany({
      where: {
        deliveryPartnerId: userId,
        status: { in: ['assigned', 'picked_up', 'in_transit'] },
      },
      include: {
        order: {
          include: {
            address: true,
            items: { take: 3 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async updateDeliveryStatus(userId: string, orderId: string, status: string) {
    const assignment = await this.prisma.deliveryAssignment.findFirst({
      where: { orderId, deliveryPartnerId: userId },
    })
    if (!assignment) throw new NotFoundException('Delivery assignment not found')

    const updateData: any = { status }
    if (status === 'picked_up') updateData.pickedUpAt = new Date()
    if (status === 'delivered') updateData.deliveredAt = new Date()

    await this.prisma.deliveryAssignment.update({
      where: { id: assignment.id },
      data: updateData,
    })

    if (status === 'picked_up') {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.OUT_FOR_DELIVERY },
      })
      await this.prisma.orderStatusHistory.create({
        data: { orderId, status: OrderStatus.OUT_FOR_DELIVERY, note: 'Picked up by delivery partner' },
      })
      this.notificationsGateway.broadcastOrderStatus(orderId, 'OUT_FOR_DELIVERY')
    }

    if (status === 'delivered') {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.DELIVERED, deliveredAt: new Date() },
      })
      await this.prisma.orderStatusHistory.create({
        data: { orderId, status: OrderStatus.DELIVERED, note: 'Delivered successfully' },
      })
      this.notificationsGateway.broadcastOrderStatus(orderId, 'DELIVERED')
    }

    return { message: `Delivery status updated to ${status}` }
  }
}
