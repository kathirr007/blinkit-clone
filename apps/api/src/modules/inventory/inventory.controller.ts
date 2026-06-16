import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { UpdateStockDto } from './dto/update-stock.dto'
import { InventoryService } from './inventory.service'

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
      page ? Number.parseInt(page) : 1,
      limit ? Number.parseInt(limit) : 20,
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
      page ? Number.parseInt(page) : 1,
      limit ? Number.parseInt(limit) : 20,
    )
  }
}
