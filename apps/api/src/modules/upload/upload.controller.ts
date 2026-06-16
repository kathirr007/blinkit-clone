import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { UserRole } from '@prisma/client'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { UploadService } from './upload.service'

@Controller('upload')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!/^image\/(?:jpeg|png|webp|gif)$/.test(file.mimetype)) {
          cb(new BadRequestException('Only image files are allowed'), false)
        }
        else {
          cb(null, true)
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided')
    const url = await this.uploadService.uploadFile(file, 'products')
    return { url }
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!/^image\/(?:jpeg|png|webp|gif)$/.test(file.mimetype)) {
          cb(new BadRequestException('Only image files are allowed'), false)
        }
        else {
          cb(null, true)
        }
      },
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) throw new BadRequestException('No files provided')
    const urls = await this.uploadService.uploadMultiple(files, 'products')
    return { urls }
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.uploadService.deleteFile(key)
    return { message: 'File deleted' }
  }
}
