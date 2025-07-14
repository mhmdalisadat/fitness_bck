import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schemas/users.schema';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { phoneNumber, password, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.databaseService.getDb()
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('کاربر با این شماره تلفن قبلاً ثبت شده است');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const [newUser] = await this.databaseService.getDb()
      .insert(users)
      .values({
        ...userData,
        phoneNumber,
        password: hashedPassword,
        trainingGoals: userData.trainingGoals ? JSON.stringify(userData.trainingGoals) : null,
        medicalConditions: userData.medicalConditions ? JSON.stringify(userData.medicalConditions) : null,
        injuries: userData.injuries ? JSON.stringify(userData.injuries) : null,
      })
      .returning();

    // Generate tokens
    const tokens = await this.generateTokens(newUser.id, newUser.phoneNumber);

    // Update user with refresh token
    await this.databaseService.getDb()
      .update(users)
      .set({ refreshToken: tokens.refreshToken })
      .where(eq(users.id, newUser.id));

    return {
      user: {
        id: newUser.id,
        phoneNumber: newUser.phoneNumber,
        name: newUser.name,
        role: newUser.role,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { phoneNumber, password } = loginDto;

    // Find user
    const [user] = await this.databaseService.getDb()
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('شماره تلفن یا رمز عبور اشتباه است');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('شماره تلفن یا رمز عبور اشتباه است');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('حساب کاربری شما غیرفعال است');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.phoneNumber);

    // Update refresh token
    await this.databaseService.getDb()
      .update(users)
      .set({ refreshToken: tokens.refreshToken })
      .where(eq(users.id, user.id));

    return {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Find user
      const [user] = await this.databaseService.getDb()
        .select()
        .from(users)
        .where(eq(users.id, payload.sub))
        .limit(1);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('توکن نامعتبر است');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.phoneNumber);

      // Update refresh token
      await this.databaseService.getDb()
        .update(users)
        .set({ refreshToken: tokens.refreshToken })
        .where(eq(users.id, user.id));

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('توکن نامعتبر است');
    }
  }

  async logout(userId: number) {
    await this.databaseService.getDb()
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.id, userId));
  }

  private async generateTokens(userId: number, phoneNumber: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          phoneNumber,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          phoneNumber,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}