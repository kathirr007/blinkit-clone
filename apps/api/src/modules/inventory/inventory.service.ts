import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateStockDto } from './dto/update-stock.dto'

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit
    const where: any = {}

    if (search) {
      where.product = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where,
        include: {
          product: {
            select: { id: true, name: true, sku: true, price: true, unit: true, unitValue: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.inventory.count({ where }),
    ])

    return {
      data: items.map((i) => ({
        ...i,
        availableStock: i.stockQuantity - i.reservedQuantity,
        isLowStock: i.stockQuantity - i.reservedQuantity <= i.lowStockThreshold,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async getLowStock() {
    const items = await this.prisma.$queryRaw<any[]>`
      SELECT i.*, p.name as "productName", p.sku, p.price
      FROM inventory i
      JOIN products p ON p.id = i."productId"
      WHERE i."stockQuantity" - i."reservedQuantity" <= i."lowStockThreshold"
      ORDER BY (i."stockQuantity" - i."reservedQuantity") ASC
    `
    return items
  }

  async updateStock(productId: string, dto: UpdateStockDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    })
    if (!inventory) throw new NotFoundException('Inventory record not found')

    const updated = await this.prisma.inventory.update({
      where: { productId },
      data: {
        stockQuantity: { increment: dto.change },
      },
    })

    await this.prisma.inventoryLog.create({
      data: {
        inventoryId: inventory.id,
        change: dto.change,
        reason: dto.reason,
        referenceId: dto.referenceId,
      },
    })

    return updated
  }

  async getLogs(productId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    })
    if (!inventory) throw new NotFoundException('Inventory not found')

    const [logs, total] = await Promise.all([
      this.prisma.inventoryLog.findMany({
        where: { inventoryId: inventory.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.inventoryLog.count({ where: { inventoryId: inventory.id } }),
    ])

    return {
      data: logs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }
}
