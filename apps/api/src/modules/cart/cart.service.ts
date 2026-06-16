import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'
import { AddToCartDto } from './dto/add-to-cart.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  private getCartCacheKey(userId: string) {
    return `cart:${userId}`
  }

  async getCart(userId: string) {
    const cached = await this.redis.get(this.getCartCacheKey(userId))
    if (cached) return JSON.parse(cached)

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                inventory: { select: { stockQuantity: true, reservedQuantity: true } },
              },
            },
            variant: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  inventory: { select: { stockQuantity: true, reservedQuantity: true } },
                },
              },
              variant: true,
            },
          },
        },
      })
    }

    const result = this.transformCart(cart)
    await this.redis.set(this.getCartCacheKey(userId), JSON.stringify(result), 300)
    return result
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { inventory: true },
    })

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found')
    }

    const availableStock = product.inventory
      ? product.inventory.stockQuantity - product.inventory.reservedQuantity
      : 0

    if (availableStock < dto.quantity) {
      throw new BadRequestException('Insufficient stock')
    }

    if (dto.quantity > product.maxOrderQty) {
      throw new BadRequestException(`Maximum ${product.maxOrderQty} items allowed`)
    }

    if (dto.variantId) {
      const variant = await this.prisma.productVariant.findFirst({
        where: { id: dto.variantId, productId: dto.productId, isActive: true },
      })
      if (!variant) throw new NotFoundException('Product variant not found')
    }

    let cart = await this.prisma.cart.findUnique({ where: { userId } })
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } })
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId_variantId: {
          cartId: cart.id,
          productId: dto.productId,
          variantId: dto.variantId ?? null as any,
        },
      },
    })

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity
      if (newQty > product.maxOrderQty) {
        throw new BadRequestException(`Maximum ${product.maxOrderQty} items allowed`)
      }
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      })
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          variantId: dto.variantId || null,
          quantity: dto.quantity,
        },
      })
    }

    await this.invalidateCache(userId)
    return this.getCart(userId)
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } })
    if (!cart) throw new NotFoundException('Cart not found')

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: { include: { inventory: true } } },
    })

    if (!item) throw new NotFoundException('Cart item not found')

    if (dto.quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } })
    } else {
      if (dto.quantity > item.product.maxOrderQty) {
        throw new BadRequestException(`Maximum ${item.product.maxOrderQty} items allowed`)
      }

      const availableStock = item.product.inventory
        ? item.product.inventory.stockQuantity - item.product.inventory.reservedQuantity
        : 0

      if (dto.quantity > availableStock) {
        throw new BadRequestException('Insufficient stock')
      }

      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: dto.quantity },
      })
    }

    await this.invalidateCache(userId)
    return this.getCart(userId)
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } })
    if (!cart) throw new NotFoundException('Cart not found')

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    })
    if (!item) throw new NotFoundException('Cart item not found')

    await this.prisma.cartItem.delete({ where: { id: itemId } })
    await this.invalidateCache(userId)
    return this.getCart(userId)
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } })
    if (!cart) return { items: [], count: 0, subtotal: 0 }

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    await this.invalidateCache(userId)
    return { items: [], count: 0, subtotal: 0 }
  }

  async getCartCount(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    })
    if (!cart) return { count: 0 }
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    return { count }
  }

  private async invalidateCache(userId: string) {
    await this.redis.del(this.getCartCacheKey(userId))
  }

  private transformCart(cart: any) {
    const items = cart.items.map((item: any) => {
      const price = item.variant ? Number(item.variant.price) : Number(item.product.price)
      const compareAtPrice = item.variant
        ? item.variant.compareAtPrice ? Number(item.variant.compareAtPrice) : null
        : item.product.compareAtPrice ? Number(item.product.compareAtPrice) : null

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price,
        compareAtPrice,
        total: price * item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          unit: item.product.unit,
          unitValue: item.product.unitValue,
          image: item.product.images[0]?.url || null,
          maxOrderQty: item.product.maxOrderQty,
          inStock: item.product.inventory
            ? item.product.inventory.stockQuantity - item.product.inventory.reservedQuantity > 0
            : false,
        },
        variant: item.variant
          ? { id: item.variant.id, name: item.variant.name }
          : null,
      }
    })

    const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0)
    const count = items.reduce((sum: number, item: any) => sum + item.quantity, 0)

    return {
      id: cart.id,
      items,
      count,
      subtotal,
    }
  }
}
