import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { DeliveryService } from './delivery.service'
import { AssignDeliveryDto } from './dto/assign-delivery.dto'
import { UpdateLocationDto } from './dto/update-location.dto'

@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('admin/delivery/partners')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getPartners() {
    return this.deliveryService.getPartners()
  }

  @Post('admin/delivery/assign')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  assign(@Body() dto: AssignDeliveryDto) {
    return this.deliveryService.assignPartner(dto)
  }

  @Patch('delivery/location')
  updateLocation(@CurrentUser('id') userId: string, @Body() dto: UpdateLocationDto) {
    return this.deliveryService.updateLocation(userId, dto)
  }

  @Get('delivery/active')
  getActive(@CurrentUser('id') userId: string) {
    return this.deliveryService.getActiveDeliveries(userId)
  }

  @Patch('delivery/:orderId/status')
  updateStatus(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ) {
    return this.deliveryService.updateDeliveryStatus(userId, orderId, status)
  }
}
