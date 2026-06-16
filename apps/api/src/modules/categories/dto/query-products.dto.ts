import { Type } from 'class-transformer'
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class QueryProductsDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number

  @IsOptional()
  @IsString()
  brand?: string

  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'newest', 'popular'])
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
}
