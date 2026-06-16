import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
  }

  async findOne(userId: string, id: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    })
    if (!address) throw new NotFoundException('Address not found')
    return address
  }

  async create(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const count = await this.prisma.address.count({ where: { userId } })
    const isDefault = dto.isDefault || count === 0

    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
        isDefault,
      },
    })
  }

  async update(userId: string, id: string, dto: UpdateAddressDto) {
    await this.findOne(userId, id)

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    return this.prisma.address.update({
      where: { id },
      data: dto,
    })
  }

  async remove(userId: string, id: string) {
    const address = await this.findOne(userId, id)
    await this.prisma.address.delete({ where: { id } })

    if (address.isDefault) {
      const first = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      if (first) {
        await this.prisma.address.update({
          where: { id: first.id },
          data: { isDefault: true },
        })
      }
    }

    return { message: 'Address deleted successfully' }
  }

  async setDefault(userId: string, id: string) {
    await this.findOne(userId, id)

    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    })

    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    })
  }
}
