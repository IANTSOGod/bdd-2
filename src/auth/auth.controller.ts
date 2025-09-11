import { Body, Controller, Post } from '@nestjs/common';
import { Signupdto } from 'src/interfaces/auth/dto/signupdto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('signup')
  async signup(@Body() data: Signupdto) {
    return this.authservice.signup(data);
  }
}
