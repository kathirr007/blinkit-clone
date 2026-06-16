import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { UpdateProfileDto } from './dto';

interface TokenPayload {
  sub: string;
  phone: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string }> {
    const isDev = this.configService.get<string>('default.environment') === 'development';
    const code = isDev ? '123456' : this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalidate any existing OTPs for this phone
    await this.prisma.otp.updateMany({
      where: { phone, verified: false },
      data: { verified: true },
    });

    // Find user if exists (to link OTP)
    const user = await this.prisma.user.findUnique({ where: { phone } });

    // Create new OTP record
    await this.prisma.otp.create({
      data: {
        phone,
        code,
        expiresAt,
        userId: user?.id || null,
      },
    });

    // Store OTP in Redis for fast lookup with 5min TTL
    await this.redisService.set(`otp:${phone}`, code, 300);

    // In production, integrate with SMS gateway here
    if (!isDev) {
      this.logger.log(`OTP sent to ${phone}`);
    } else {
      this.logger.debug(`[DEV] OTP for ${phone}: ${code}`);
    }

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, code: string): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    // Check OTP from Redis first (faster), fallback to DB
    const cachedOtp = await this.redisService.get(`otp:${phone}`);

    if (cachedOtp) {
      if (cachedOtp !== code) {
        throw new UnauthorizedException('Invalid OTP');
      }
    } else {
      // Fallback to database check
      const otpRecord = await this.prisma.otp.findFirst({
        where: {
          phone,
          code,
          verified: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!otpRecord) {
        throw new UnauthorizedException('Invalid or expired OTP');
      }
    }

    // Mark OTP as verified
    await this.prisma.otp.updateMany({
      where: { phone, code, verified: false },
      data: { verified: true },
    });

    // Clear OTP from Redis
    await this.redisService.del(`otp:${phone}`);

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone } });
    let isNewUser = false;

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          isVerified: true,
        },
      });
      isNewUser = true;
    } else if (!user.isVerified) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(phone: string, password: string): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Password not set. Please login using OTP',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // Verify the refresh token exists in DB
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      // Clean up expired token
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Verify the JWT signature
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('default.jwt.refreshSecret'),
      });
    } catch {
      // Token is invalid, delete it
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Delete the old refresh token (rotation)
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new token pair
    const tokens = await this.generateTokens({
      sub: storedToken.user.id,
      phone: storedToken.user.phone,
      role: storedToken.user.role,
    });

    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<{ message: string }> {
    // Delete the specific refresh token
    const deleted = await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Refresh token not found');
    }

    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    // Check if email is already taken by another user
    if (data.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email is already in use');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
      },
    });

    return this.sanitizeUser(user);
  }

  async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('default.jwt.secret'),
      expiresIn: this.configService.get<string>('default.jwt.expiresIn'),
    });

    const refreshExpiresIn = this.configService.get<string>('default.jwt.refreshExpiresIn') || '7d';
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('default.jwt.refreshSecret'),
      expiresIn: refreshExpiresIn,
    });

    // Calculate refresh token expiry date
    const expiresAt = this.calculateExpiryDate(refreshExpiresIn);

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        userId: payload.sub,
        token: refreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  private calculateExpiryDate(duration: string): Date {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) {
      // Default to 30 days if format is unrecognized
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }
}
