import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async search(query: string, filters?: { category?: string, brand?: string, minPrice?: number, maxPrice?: number, page?: number, limit?: number }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const skip = (page - 1) * limit

    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { category: { name: { contains: query, mode: 'insensitive' } } },
      ],
    }

    if (filters?.category) {
      where.category = { slug: filters.category }
    }
    if (filters?.brand) {
      where.brand = { contains: filters.brand, mode: 'insensitive' }
    }
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {}
      if (filters.minPrice) where.price.gte = filters.minPrice
      if (filters.maxPrice) where.price.lte = filters.maxPrice
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true, slug: true } },
          inventory: { select: { stockQuantity: true, reservedQuantity: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { avgRating: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ])

    const data = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      unit: p.unit,
      unitValue: p.unitValue,
      image: p.images[0]?.url || null,
      category: p.category,
      avgRating: p.avgRating,
      totalReviews: p.totalReviews,
      inStock: p.inventory
        ? p.inventory.stockQuantity - p.inventory.reservedQuantity > 0
        : false,
    }))

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async getSuggestions(query: string) {
    const cacheKey = `search:suggestions:${query.toLowerCase().trim()}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { name: true, slug: true, brand: true, category: { select: { name: true } } },
      take: 8,
      orderBy: { avgRating: 'desc' },
    })

    const suggestions = products.map(p => ({
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      category: p.category.name,
    }))

    await this.redis.set(cacheKey, JSON.stringify(suggestions), 300)
    return suggestions
  }
}
