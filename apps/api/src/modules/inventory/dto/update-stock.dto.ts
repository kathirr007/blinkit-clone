import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateStockDto {
  @IsInt()
  change: number

  @IsString()
  @IsNotEmpty()
  reason: string

  @IsString()
  @IsOptional()
  referenceId?: string
}
