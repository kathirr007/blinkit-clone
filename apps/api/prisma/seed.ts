import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999',
      email: 'admin@blinkit.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isVerified: true,
    },
  })

  // Create delivery partner
  const deliveryPartner = await prisma.user.upsert({
    where: { phone: '8888888888' },
    update: {},
    create: {
      phone: '8888888888',
      name: 'Delivery Partner',
      role: UserRole.DELIVERY_PARTNER,
      isVerified: true,
    },
  })

  // Create customer
  const customer = await prisma.user.upsert({
    where: { phone: '7777777777' },
    update: {},
    create: {
      phone: '7777777777',
      email: 'customer@example.com',
      name: 'John Doe',
      passwordHash: await bcrypt.hash('password123', 10),
      role: UserRole.CUSTOMER,
      isVerified: true,
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'fruits-vegetables' },
      update: {},
      create: {
        name: 'Fruits & Vegetables',
        slug: 'fruits-vegetables',
        description: 'Fresh fruits and vegetables delivered to your door',
        imageUrl: '/images/categories/fruits-vegetables.png',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'dairy-bread-eggs' },
      update: {},
      create: {
        name: 'Dairy, Bread & Eggs',
        slug: 'dairy-bread-eggs',
        description: 'Fresh dairy products, bread, and eggs',
        imageUrl: '/images/categories/dairy.png',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'snacks-drinks' },
      update: {},
      create: {
        name: 'Snacks & Drinks',
        slug: 'snacks-drinks',
        description: 'Chips, biscuits, cold drinks, and more',
        imageUrl: '/images/categories/snacks.png',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'instant-food' },
      update: {},
      create: {
        name: 'Instant & Frozen Food',
        slug: 'instant-food',
        description: 'Ready to eat meals and frozen items',
        imageUrl: '/images/categories/instant-food.png',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cleaning-household' },
      update: {},
      create: {
        name: 'Cleaning & Household',
        slug: 'cleaning-household',
        description: 'Detergents, cleaners, and household essentials',
        imageUrl: '/images/categories/cleaning.png',
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'personal-care' },
      update: {},
      create: {
        name: 'Personal Care',
        slug: 'personal-care',
        description: 'Bath, skin care, and grooming products',
        imageUrl: '/images/categories/personal-care.png',
        sortOrder: 6,
      },
    }),
  ])

  // Create subcategories
  const subcategories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'fresh-fruits' },
      update: {},
      create: {
        name: 'Fresh Fruits',
        slug: 'fresh-fruits',
        parentId: categories[0].id,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fresh-vegetables' },
      update: {},
      create: {
        name: 'Fresh Vegetables',
        slug: 'fresh-vegetables',
        parentId: categories[0].id,
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'milk' },
      update: {},
      create: {
        name: 'Milk',
        slug: 'milk',
        parentId: categories[1].id,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'bread-buns' },
      update: {},
      create: {
        name: 'Bread & Buns',
        slug: 'bread-buns',
        parentId: categories[1].id,
        sortOrder: 2,
      },
    }),
  ])

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'fresh-banana-6-pcs' },
      update: {},
      create: {
        name: 'Fresh Banana',
        slug: 'fresh-banana-6-pcs',
        description: 'Fresh yellow bananas, perfect for breakfast or snacking',
        shortDescription: '6 pieces, ripe',
        categoryId: subcategories[0].id,
        brand: 'Farm Fresh',
        sku: 'FRU-BAN-001',
        price: 45.0,
        compareAtPrice: 55.0,
        unit: 'pack',
        unitValue: '6 pcs',
        isActive: true,
        isFeatured: true,
        images: {
          create: [
            { url: '/images/products/banana.png', altText: 'Fresh Banana', isPrimary: true, sortOrder: 0 },
          ],
        },
        inventory: {
          create: { stockQuantity: 100, lowStockThreshold: 20 },
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'red-apple-4-pcs' },
      update: {},
      create: {
        name: 'Red Apple',
        slug: 'red-apple-4-pcs',
        description: 'Crisp and juicy red apples imported from Shimla',
        shortDescription: '4 pieces',
        categoryId: subcategories[0].id,
        brand: 'Farm Fresh',
        sku: 'FRU-APL-001',
        price: 149.0,
        compareAtPrice: 180.0,
        unit: 'pack',
        unitValue: '4 pcs',
        isActive: true,
        isFeatured: true,
        images: {
          create: [
            { url: '/images/products/apple.png', altText: 'Red Apple', isPrimary: true, sortOrder: 0 },
          ],
        },
        inventory: {
          create: { stockQuantity: 75, lowStockThreshold: 15 },
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'amul-toned-milk-500ml' },
      update: {},
      create: {
        name: 'Amul Toned Milk',
        slug: 'amul-toned-milk-500ml',
        description: 'Pasteurized toned milk with 3% fat',
        shortDescription: '500 ml pouch',
        categoryId: subcategories[2].id,
        brand: 'Amul',
        sku: 'DAI-MLK-001',
        price: 29.0,
        unit: 'pouch',
        unitValue: '500 ml',
        isActive: true,
        isFeatured: true,
        images: {
          create: [
            { url: '/images/products/amul-milk.png', altText: 'Amul Toned Milk', isPrimary: true, sortOrder: 0 },
          ],
        },
        inventory: {
          create: { stockQuantity: 200, lowStockThreshold: 50 },
        },
        variants: {
          create: [
            { name: '500 ml', price: 29.0, sku: 'DAI-MLK-001-500' },
            { name: '1 Litre', price: 56.0, sku: 'DAI-MLK-001-1000' },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'britannia-white-bread' },
      update: {},
      create: {
        name: 'Britannia White Bread',
        slug: 'britannia-white-bread',
        description: 'Soft and fresh white bread for everyday use',
        shortDescription: '400g pack',
        categoryId: subcategories[3].id,
        brand: 'Britannia',
        sku: 'DAI-BRD-001',
        price: 45.0,
        unit: 'pack',
        unitValue: '400g',
        isActive: true,
        images: {
          create: [
            { url: '/images/products/bread.png', altText: 'Britannia White Bread', isPrimary: true, sortOrder: 0 },
          ],
        },
        inventory: {
          create: { stockQuantity: 80, lowStockThreshold: 20 },
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'onion-1kg' },
      update: {},
      create: {
        name: 'Onion',
        slug: 'onion-1kg',
        description: 'Fresh onions, essential for everyday cooking',
        shortDescription: '1 kg',
        categoryId: subcategories[1].id,
        brand: 'Farm Fresh',
        sku: 'VEG-ONI-001',
        price: 35.0,
        compareAtPrice: 45.0,
        unit: 'kg',
        unitValue: '1 kg',
        isActive: true,
        images: {
          create: [
            { url: '/images/products/onion.png', altText: 'Fresh Onion', isPrimary: true, sortOrder: 0 },
          ],
        },
        inventory: {
          create: { stockQuantity: 150, lowStockThreshold: 30 },
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'tomato-500g' },
      update: {},
      create: {
        name: 'Tomato',
        slug: 'tomato-500g',
        description: 'Fresh red tomatoes, great for salads and cooking',
        shortDescription: '500g',
        categoryId: subcategories[1].id,
        brand: 'Farm Fresh',
        sku: 'VEG-TOM-001',
        price: 25.0,
        unit: 'kg',
        unitValue: '500g',
        isActive: true,
        isFeatured: true,
        images: {
          create: [
            { url: '/images/products/tomato.png', altText: 'Fresh Tomato', isPrimary: true, sortOrder: 0 },
          ],
        },
        inventory: {
          create: { stockQuantity: 120, lowStockThreshold: 25 },
        },
      },
    }),
  ])

  // Create address for customer
  await prisma.address.upsert({
    where: { id: 'seed-address-1' },
    update: {},
    create: {
      id: 'seed-address-1',
      userId: customer.id,
      label: 'Home',
      fullName: 'John Doe',
      phone: '7777777777',
      addressLine1: '123, Green Park',
      addressLine2: 'Near Metro Station',
      landmark: 'Opposite City Mall',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      latitude: 28.5595,
      longitude: 77.2069,
      isDefault: true,
    },
  })

  // Create banners
  await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Fresh Fruits Sale',
        imageUrl: '/images/banners/fruits-sale.png',
        linkUrl: '/category/fresh-fruits',
        position: 'home_top',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Free Delivery Above ₹499',
        imageUrl: '/images/banners/free-delivery.png',
        position: 'home_top',
        sortOrder: 2,
        isActive: true,
      },
    }),
  ])

  // Create a deal
  await prisma.deal.create({
    data: {
      title: '20% Off on First Order',
      description: 'Use code FIRST20 to get 20% off on your first order',
      discountType: 'percentage',
      discountValue: 20.0,
      minOrderValue: 200.0,
      maxDiscount: 100.0,
      couponCode: 'FIRST20',
      isActive: true,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  console.log('Seed data created successfully')
  console.log({ admin: admin.id, deliveryPartner: deliveryPartner.id, customer: customer.id })
  console.log(`Created ${categories.length} categories, ${subcategories.length} subcategories, ${products.length} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
