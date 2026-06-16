import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import { extname } from 'path'

@Injectable()
export class UploadService {
  private s3: S3Client
  private bucket: string
  private endpoint: string

  constructor(private config: ConfigService) {
    this.endpoint = this.config.get('S3_ENDPOINT', 'http://localhost:9000')
    this.bucket = this.config.get('S3_BUCKET', 'blinkit-uploads')

    this.s3 = new S3Client({
      endpoint: this.endpoint,
      region: this.config.get('S3_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.config.get('S3_ACCESS_KEY', 'minioadmin'),
        secretAccessKey: this.config.get('S3_SECRET_KEY', 'minioadmin'),
      },
      forcePathStyle: true,
    })
  }

  async uploadFile(file: Express.Multer.File, folder = 'images'): Promise<string> {
    const ext = extname(file.originalname)
    const key = `${folder}/${randomUUID()}${ext}`

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    )

    return `${this.endpoint}/${this.bucket}/${key}`
  }

  async uploadMultiple(files: Express.Multer.File[], folder = 'images'): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadFile(file, folder)))
  }

  async deleteFile(url: string): Promise<void> {
    const key = url.replace(`${this.endpoint}/${this.bucket}/`, '')
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    )
  }
}
