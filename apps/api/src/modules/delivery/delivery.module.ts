import { Module } from '@nestjs/common'
import { DeliveryController } from './delivery.controller'
import { DeliveryService } from './delivery.service'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [NotificationsModule],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
