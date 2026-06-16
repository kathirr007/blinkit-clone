import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import configuration from './config/configuration'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { ProductsModule } from './modules/products/products.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { CartModule } from './modules/cart/cart.module'
import { OrdersModule } from './modules/orders/orders.module'
import { PaymentsModule } from './modules/payments/payments.module'
import { AddressesModule } from './modules/addresses/addresses.module'
import { SearchModule } from './modules/search/search.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { DeliveryModule } from './modules/delivery/delivery.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { UploadModule } from './modules/upload/upload.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    AddressesModule,
    SearchModule,
    NotificationsModule,
    DeliveryModule,
    ReviewsModule,
    InventoryModule,
    UploadModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
