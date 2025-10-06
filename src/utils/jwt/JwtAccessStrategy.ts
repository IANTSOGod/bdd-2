/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express'; // pour typer la req quand passReqToCallback = true
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { Credentialdto } from 'src/interfaces/auth/dto/Credentialdto';
import { JwtverifDto } from 'src/interfaces/auth/dto/Jwtverifdto';
import { sessiondto } from 'src/interfaces/auth/dto/Sessiondto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly authservice: AuthService,
    private readonly jwtservice: JwtService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // <-- extractor: fonction qui récupère le Bearer token depuis la req
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // on gère l'expiration manuellement dans validate()
      ignoreExpiration: true,
      // clé pour vérifier le token d'accès
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
      // IMPORTANT : permet d'avoir "req" en premier argument de validate(req, payload)
      passReqToCallback: true,
    });
  }

  // passReqToCallback:true → validate reçoit (req, payload)
  async validate(
    req: Request,
    payload: JwtverifDto,
  ): Promise<Credentialdto | (Credentialdto & { accessToken: string })> {
    // Récupère le token brut (string) depuis la request.
    // ExtractJwt.fromAuthHeaderAsBearerToken() renvoie une fonction → il faut l'appeler avec req.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      // pas de token trouvé → accès interdit
      throw new UnauthorizedException('No token found in request');
    }

    try {
      // Vérifie le token d'accès : s'il est valide et non expiré, verifyAsync résout.
      // Si le token est expiré ou invalide, verifyAsync lance une erreur.
      await this.jwtservice.verifyAsync(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });
      // Si on arrive ici, le token est valide et pas expiré → on continue
    } catch (err: any) {
      // Si l'erreur indique que le token est expiré, on tente la logique de refresh
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.name === 'TokenExpiredError') {
        // Récupère la session stockée en Redis (clé choisie: session:{id})
        const str = await this.redis.get(`session:${payload.id}`);
        if (!str) {
          throw new UnauthorizedException('Relog please');
        }

        let session: sessiondto;
        try {
          // parse de la session (doit contenir au minimum le refresh token)
          session = JSON.parse(str) as sessiondto;
        } catch {
          throw new UnauthorizedException('Session corrompue');
        }

        try {
          // Vérifie le refresh token (s'il est valide et non expiré)
          await this.jwtservice.verifyAsync(session.token, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET'),
          });

          // Si le refresh token est valide, on signe un nouveau access token
          const newAccessToken = await this.authservice.jwtsignaccess({
            id: payload.id,
          });

          // Récupère l'utilisateur en base pour renvoyer ses infos
          const user = await this.prismaservice.user.findUnique({
            where: { id: payload.id },
          });
          if (!user) throw new UnauthorizedException('Utilisateur introuvable');

          // On renvoie l'utilisateur + le nouveau access token.
          // (Côté controller/client il faudra gérer la récupération de accessToken dans req.user)
          return {
            email: user.email,
            name: user.name,
            accessToken: newAccessToken,
          } satisfies Credentialdto & { accessToken: string };
        } catch (refreshErr) {
          // refresh token invalide ou expiré
          console.error('Refresh verification failed', refreshErr);
          throw new UnauthorizedException('Refresh token invalide ou expiré');
        }
      }

      // Toute autre erreur de vérification → token invalide
      console.error('Access token verification error', err);
      throw new UnauthorizedException('Token invalide');
    }

    // Cas normal : access token valide → on retourne simplement les infos utilisateur
    const user = await this.prismaservice.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    return {
      email: user.email,
      name: user.name,
    } satisfies Credentialdto;
  }
}
