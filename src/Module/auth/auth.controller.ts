import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string,  // Récupère le rôle passé dans le corps de la requête
  ) {
    return this.authService.login(email, password, role);
  }
}
