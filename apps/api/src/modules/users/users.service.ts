import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  private readonly SALT_ROUNDS = 10

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
      },
    })

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`)
    }

    return this.sanitizeUser(user)
  }

  async findByPhone(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    })

    return user ? this.sanitizeUser(user) : null
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    return user ? this.sanitizeUser(user) : null
  }

  async create(data: {
    phone: string
    name?: string
    email?: string
    password?: string
  }) {
    // Check if phone already exists
    const existingByPhone = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    })

    if (existingByPhone) {
      throw new ConflictException('A user with this phone number already exists')
    }

    // Check if email already exists
    if (data.email) {
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email: data.email },
      })

      if (existingByEmail) {
        throw new ConflictException('A user with this email already exists')
      }
    }

    // Hash password if provided
    let passwordHash: string | undefined
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS)
    }

    const user = await this.prisma.user.create({
      data: {
        phone: data.phone,
        name: data.name,
        email: data.email,
        passwordHash,
        isVerified: false,
      },
    })

    return this.sanitizeUser(user)
  }

  async update(id: string, data: UpdateUserDto) {
    // Verify user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" not found`)
    }

    // Check email uniqueness if updating email
    if (data.email && data.email !== existingUser.email) {
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email: data.email },
      })

      if (existingByEmail) {
        throw new ConflictException('A user with this email already exists')
      }
    }

    // Build update payload
    const updateData: Prisma.UserUpdateInput = {}

    if (data.name !== undefined) {
      updateData.name = data.name
    }

    if (data.email !== undefined) {
      updateData.email = data.email
    }

    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl
    }

    if (data.role !== undefined) {
      updateData.role = data.role
    }

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS)
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    })

    return this.sanitizeUser(user)
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user
    return sanitized
  }
}
