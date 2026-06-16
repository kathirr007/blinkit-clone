import { Transform, Type } from 'class-transformer'
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class QueryProductDto extends PaginationDto {
  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  brand?: string

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
  search?: string

  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'newest', 'popular'])
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean
}
