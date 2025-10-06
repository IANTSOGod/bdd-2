import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { Logindto } from 'src/interfaces/auth/dto/logindto';
import { Signupdto } from 'src/interfaces/auth/dto/signupdto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly jwtservice: JwtService,
    private readonly configservice: ConfigService,
    private readonly redisservice: RedisService,
  ) {}

  async signup(data: Signupdto) {
    const { fname, lname, email, password } = data;
    const user = await this.prismaservice.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      const newUser = await this.prismaservice.user.create({
        data: {
          name: fname + ' ' + (lname ? lname : ''),
          email: email,
        },
      });
      if (newUser) {
        const newhashedmdp = await hash(password, 12);
        try {
          await this.prismaservice.account.create({
            data: {
              password: newhashedmdp,
              provider: 'EAP',
              user: {
                connect: {
                  id: newUser.id,
                },
              },
            },
          });
          return { message: 'Compte créé' };
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException({
            message: 'Erreur de création de compte',
          });
        }
      } else {
        throw new InternalServerErrorException({
          message: 'Erreur création utilisateur',
        });
      }
    } else {
      throw new UnauthorizedException({ message: 'User dupliqué' });
    }
  }

  async login(data: Logindto) {
    const { email, password } = data;

    const user = await this.prismaservice.user.findUnique({
      where: { email: email },
    });
    if (user) {
      if (user.emailVerified) {
        const account = await this.prismaservice.account.findFirst({
          where: { userId: user.id, provider: 'EAP' },
        });
        if (account) {
          const isvalid = await compare(password, account.password as string);
          if (isvalid) {
            const accesstoken = await this.jwtsignaccess({ id: user.id });
            const refreshtoken = await this.jwtsignrefresh({ id: user.id });
            await this.prismaservice.account.update({
              where: {
                id: account.id,
              },
              data: {
                accessToken: accesstoken,
                refreshToken: refreshtoken,
              },
            });
            await this.prismaservice.session.deleteMany({
              where: { userId: user.id },
            });
            const currentsession = await this.prismaservice.session.create({
              data: {
                token: refreshtoken,
                ipAddress: data.ip,
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
            await this.redisservice.set(
              `session:${user.id}`,
              JSON.stringify(currentsession),
              60 * 60 * 1,
            );
            return {
              accesstoken: accesstoken,
            };
          } else {
            throw new UnauthorizedException({
              message: 'Mot de passe incorrect',
            });
          }
        } else {
          throw new UnauthorizedException({
            message: 'Connection avec autre provider',
          });
        }
      } else {
        throw new UnauthorizedException({ message: 'Email non vérifié' });
      }
    } else {
      throw new NotFoundException({ message: 'User non trouvé' });
    }
  }

  async jwtsignaccess(data: { id: string }) {
    const jwtaccesstoken = await this.jwtservice.signAsync(data, {
      expiresIn: '15m',
      secret: this.configservice.get<string>('JWT_ACCESS_SECRET'),
    });
    if (jwtaccesstoken) {
      return jwtaccesstoken;
    } else {
      throw new UnauthorizedException({ message: 'Erreur de sign' });
    }
  }

  async jwtsignrefresh(data: { id: string }) {
    const jwtrefreshtoken = await this.jwtservice.signAsync(data, {
      expiresIn: '1d',
      secret: this.configservice.get<string>('JWT_REFRESH_SECRET'),
    });
    if (jwtrefreshtoken) {
      return jwtrefreshtoken;
    } else {
      throw new UnauthorizedException({
        message: 'erreur de génération refresh token',
      });
    }
  }
}
