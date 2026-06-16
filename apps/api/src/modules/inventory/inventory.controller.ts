import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { UpdateStockDto } from './dto/update-stock.dto'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { UserRole } from '@prisma/client'

@Controller('admin/inventory')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.inventoryService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      search,
    )
  }

  @Get('low-stock')
  getLowStock() {
    return this.inventoryService.getLowStock()
  }

  @Patch(':productId')
  updateStock(@Param('productId') productId: string, @Body() dto: UpdateStockDto) {
    return this.inventoryService.updateStock(productId, dto)
  }

  @Get(':productId/logs')
  getLogs(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inventoryService.getLogs(
      productId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    )
  }
}
