// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Credentialdto } from 'src/interfaces/auth/dto/Credentialdto';
import { JwtverifDto } from 'src/interfaces/auth/dto/Jwtverifdto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly config: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtverifDto) {
    const user = await this.prismaservice.user.findUnique({
      where: { id: payload.id },
    });
    if (user) {
      return {
        email: user.email,
        name: user.name,
      } satisfies Credentialdto;
    }
  }
}
