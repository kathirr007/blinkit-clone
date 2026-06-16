import { Module } from '@nestjs/common'
import { NotificationsModule } from '../notifications/notifications.module'
import { DeliveryController } from './delivery.controller'
import { DeliveryService } from './delivery.service'

@Module({
  imports: [NotificationsModule],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
