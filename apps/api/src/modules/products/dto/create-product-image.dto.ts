import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  url: string

  @IsOptional()
  @IsString()
  altText?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean
}
