import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateReviewDto } from './dto/create-review.dto'

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        include: { user: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { productId } }),
    ])

    return {
      data: reviews,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async create(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new NotFoundException('Product not found')

    const existing = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (existing) throw new ConflictException('You have already reviewed this product')

    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId, status: 'DELIVERED' },
      },
    })

    const review = await this.prisma.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        isVerified: !!hasPurchased,
      },
    })

    await this.updateProductRating(productId)
    return review
  }

  async update(userId: string, id: string, dto: Partial<CreateReviewDto>) {
    const review = await this.prisma.review.findFirst({ where: { id, userId } })
    if (!review) throw new NotFoundException('Review not found')

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        rating: dto.rating ?? review.rating,
        title: dto.title ?? review.title,
        comment: dto.comment ?? review.comment,
      },
    })

    await this.updateProductRating(review.productId)
    return updated
  }

  async remove(userId: string, id: string) {
    const review = await this.prisma.review.findFirst({ where: { id, userId } })
    if (!review) throw new NotFoundException('Review not found')

    await this.prisma.review.delete({ where: { id } })
    await this.updateProductRating(review.productId)
    return { message: 'Review deleted' }
  }

  private async updateProductRating(productId: string) {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    })

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        avgRating: result._avg.rating || 0,
        totalReviews: result._count,
      },
    })
  }
}
