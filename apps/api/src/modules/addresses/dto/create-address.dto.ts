import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Matches,
} from 'class-validator'

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  label: string = 'Home'

  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid phone number' })
  phone: string

  @IsString()
  @IsNotEmpty()
  addressLine1: string

  @IsString()
  @IsOptional()
  addressLine2?: string

  @IsString()
  @IsOptional()
  landmark?: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  state: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Invalid pincode' })
  pincode: string

  @IsNumber()
  @IsOptional()
  latitude?: number

  @IsNumber()
  @IsOptional()
  longitude?: number

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean
}
