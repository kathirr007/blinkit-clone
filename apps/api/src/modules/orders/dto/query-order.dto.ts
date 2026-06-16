import { IsEnum, IsOptional } from 'class-validator'
import { OrderStatus } from '@prisma/client'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class QueryOrderDto extends PaginationDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus
}
