import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { createPaginatedResponse, PaginatedResponse } from '../../common/dto/pagination.dto';

const CACHE_KEY_FEATURED = 'products:featured';
const CACHE_TTL = 300; // 5 minutes

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(query: QueryProductDto): Promise<PaginatedResponse<any>> {
    const where: any = {
      isActive: true,
    };

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.brand) {
      where.brand = query.brand;
    }

    if (query.minPrice !== undefined) {
      where.price = { ...where.price, gte: query.minPrice };
    }

    if (query.maxPrice !== undefined) {
      where.price = { ...where.price, lte: query.maxPrice };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
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
          images: { where: { isPrimary: true }, take: 1 },
          inventory: { select: { stockQuantity: true, reservedQuantity: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const transformedProducts = products.map((product) => {
      const { inventory, ...rest } = product;
      return {
        ...rest,
        inStock: inventory
          ? inventory.stockQuantity - inventory.reservedQuantity > 0
          : false,
      };
    });

    return createPaginatedResponse(transformedProducts, total, query.page, query.limit);
  }

  async findFeatured() {
    const cached = await this.redis.get(CACHE_KEY_FEATURED);
    if (cached) {
      this.logger.debug('Returning featured products from cache');
      return JSON.parse(cached);
    }

    const products = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        inventory: { select: { stockQuantity: true, reservedQuantity: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    const transformedProducts = products.map((product) => {
      const { inventory, ...rest } = product;
      return {
        ...rest,
        inStock: inventory
          ? inventory.stockQuantity - inventory.reservedQuantity > 0
          : false,
      };
    });

    await this.redis.set(CACHE_KEY_FEATURED, JSON.stringify(transformedProducts), CACHE_TTL);
    this.logger.debug('Featured products cached');

    return transformedProducts;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
        inventory: { select: { stockQuantity: true, reservedQuantity: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    const { inventory, ...rest } = product;
    return {
      ...rest,
      inStock: inventory
        ? inventory.stockQuantity - inventory.reservedQuantity > 0
        : false,
    };
  }

  async create(dto: CreateProductDto) {
    const slug = await this.generateSlug(dto.name);
    const { variants, ...productData } = dto;

    const product = await this.prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: productData.name,
          slug,
          description: productData.description,
          shortDescription: productData.shortDescription,
          categoryId: productData.categoryId,
          brand: productData.brand,
          sku: productData.sku,
          barcode: productData.barcode,
          price: productData.price,
          compareAtPrice: productData.compareAtPrice,
          costPrice: productData.costPrice,
          unit: productData.unit ?? 'piece',
          unitValue: productData.unitValue,
          minOrderQty: productData.minOrderQty ?? 1,
          maxOrderQty: productData.maxOrderQty ?? 10,
          isFeatured: productData.isFeatured ?? false,
        },
      });

      await tx.inventory.create({
        data: {
          productId: created.id,
          stockQuantity: 0,
        },
      });

      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((variant) => ({
            productId: created.id,
            name: variant.name,
            price: variant.price,
            sku: variant.sku,
            compareAtPrice: variant.compareAtPrice,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: created.id },
        include: {
          variants: true,
          inventory: true,
        },
      });
    });

    await this.invalidateCache();
    this.logger.log(`Product created: ${product!.id} (${product!.name})`);

    return product!;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    const { variants, ...updateData } = dto;

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        inventory: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    await this.invalidateCache();
    this.logger.log(`Product updated: ${product.id}`);

    return product;
  }

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    await this.invalidateCache();
    this.logger.log(`Product soft-deleted: ${product.id}`);

    return product;
  }

  async addImages(productId: string, images: CreateProductImageDto[]) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException(`Product with id "${productId}" not found`);
    }

    const createdImages = await this.prisma.productImage.createMany({
      data: images.map((image) => ({
        productId,
        url: image.url,
        altText: image.altText,
        sortOrder: image.sortOrder ?? 0,
        isPrimary: image.isPrimary ?? false,
      })),
    });

    this.logger.log(`Added ${createdImages.count} images to product: ${productId}`);

    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async removeImage(productId: string, imageId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException(`Product with id "${productId}" not found`);
    }

    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!image) {
      throw new NotFoundException(`Image with id "${imageId}" not found for product "${productId}"`);
    }

    await this.prisma.productImage.delete({ where: { id: imageId } });

    this.logger.log(`Removed image ${imageId} from product: ${productId}`);

    return { deleted: true };
  }

  private async invalidateCache(): Promise<void> {
    await this.redis.del(CACHE_KEY_FEATURED);
    await this.redis.flushPattern('products:*');
    this.logger.debug('Products cache invalidated');
  }

  private async generateSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const existing = await this.prisma.product.findUnique({
      where: { slug: baseSlug },
    });

    if (!existing) {
      return baseSlug;
    }

    const suffix = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${suffix}`;
  }
}
