import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { createPaginatedResponse, PaginatedResponse } from '../../common/dto/pagination.dto';

const CACHE_KEY_TREE = 'categories:tree';
const CACHE_TTL = 300; // 5 minutes

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll() {
    const cached = await this.redis.get(CACHE_KEY_TREE);
    if (cached) {
      this.logger.debug('Returning categories tree from cache');
      return JSON.parse(cached);
    }

    const categories = await this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    await this.redis.set(CACHE_KEY_TREE, JSON.stringify(categories), CACHE_TTL);
    this.logger.debug('Categories tree cached');

    return categories;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  async findProducts(slug: string, query: QueryProductsDto): Promise<PaginatedResponse<any>> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    const where: any = {
      categoryId: category.id,
      isActive: true,
    };

    if (query.minPrice !== undefined) {
      where.price = { ...where.price, gte: query.minPrice };
    }

    if (query.maxPrice !== undefined) {
      where.price = { ...where.price, lte: query.maxPrice };
    }

    if (query.brand) {
      where.brand = query.brand;
    }

    let orderBy: any;
    switch (query.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popular':
        orderBy = [{ avgRating: 'desc' }, { totalReviews: 'desc' }];
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: query.skip,
        take: query.limit,
        include: {
          images: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return createPaginatedResponse(products, total, query.page, query.limit);
  }

  async create(dto: CreateCategoryDto) {
    const slug = await this.generateSlug(dto.name);

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        parentId: dto.parentId,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    await this.invalidateCache();
    this.logger.log(`Category created: ${category.id} (${category.name})`);

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: dto,
    });

    await this.invalidateCache();
    this.logger.log(`Category updated: ${category.id}`);

    return category;
  }

  async remove(id: string) {
    const existing = await this.prisma.category.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    await this.invalidateCache();
    this.logger.log(`Category soft-deleted: ${category.id}`);

    return category;
  }

  async invalidateCache(): Promise<void> {
    await this.redis.del(CACHE_KEY_TREE);
    this.logger.debug('Categories cache invalidated');
  }

  private async generateSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const existing = await this.prisma.category.findUnique({
      where: { slug: baseSlug },
    });

    if (!existing) {
      return baseSlug;
    }

    const suffix = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${suffix}`;
  }
}
