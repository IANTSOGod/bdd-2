import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisModule } from 'src/redis/redis.module';
import { JwtAccessAuthGuard } from 'src/utils/jwt/JwtAccessAuthGuard';
import { JwtAccessStrategy } from 'src/utils/jwt/JwtAccessStrategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [RedisModule],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    JwtAccessAuthGuard,
    JwtAccessStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
