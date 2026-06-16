import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator'

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
