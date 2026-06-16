import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateLocationDto {
  @IsString()
  @IsNotEmpty()
  orderId: string

  @IsNumber()
  latitude: number

  @IsNumber()
  longitude: number
}
