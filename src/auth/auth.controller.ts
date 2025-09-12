import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Credentialdto } from 'src/interfaces/auth/dto/Credentialdto';
import { Logindto } from 'src/interfaces/auth/dto/logindto';
import { Signupdto } from 'src/interfaces/auth/dto/signupdto';

import { JwtAccessAuthGuard } from 'src/utils/jwt/JwtAccessAuthGuard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('me')
  private Getinfo(@Request() req: { user: Credentialdto }) {
    return req.user;
  }

  @Post('signup')
  async signup(@Body() data: Signupdto) {
    return this.authservice.signup(data);
  }

  @Post('login')
  async login(@Body() data: Logindto, @Ip() ip: string) {
    return this.authservice.login({ ...data, ip: ip });
  }
}
