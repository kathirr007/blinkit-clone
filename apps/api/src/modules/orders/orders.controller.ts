import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CreateOrderDto } from './dto/create-order.dto'
import { QueryOrderDto } from './dto/query-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { OrdersService } from './orders.service'

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('orders')
  create(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto)
  }

  @Get('orders')
  findAll(@CurrentUser('id') userId: string, @Query() query: QueryOrderDto) {
    return this.ordersService.findAll(userId, query)
  }

  @Get('orders/:id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.findOne(userId, id)
  }

  @Post('orders/:id/cancel')
  cancel(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.ordersService.cancelOrder(userId, id, reason)
  }

  @Get('orders/:id/track')
  track(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.getTrackingInfo(userId, id)
  }

  @Get('admin/orders')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin(@Query() query: QueryOrderDto) {
    return this.ordersService.findAllAdmin(query)
  }

  @Get('admin/orders/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findOneAdmin(@Param('id') id: string) {
    return this.ordersService.findOneAdmin(id)
  }

  @Patch('admin/orders/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto)
  }
}
