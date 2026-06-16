import { OrderStatus } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class QueryOrderDto extends PaginationDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus
}
