import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common'

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}

export const globalValidationPipe = new ValidationPipe(validationPipeOptions)
