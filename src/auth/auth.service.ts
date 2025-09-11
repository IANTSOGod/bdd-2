import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Signupdto } from 'src/interfaces/auth/dto/signupdto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaservice: PrismaService) {}

  async signup(data: Signupdto) {
    const { fname, lname, email, password } = data;
    const newUser = await this.prismaservice.user.create({
      data: {
        name: fname + (lname ? lname : ''),
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
        message: 'Error création utilisateur',
      });
    }
  }
}
