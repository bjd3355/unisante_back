import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string,
  ) {
    return this.authService.login(email, password, role);
  }

  @Post('register')
  async register(@Body() userDto: any) {
    return this.authService.register(userDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // Endpoint pour la connexion Google modifiée
  // On peut éventuellement ajouter le paramètre "picture" pour l'image de profil
  @Post('google-login')
  async googleLogin(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('picture') picture?: string, // facultatif
  ) {
    // Renvoie un flag "firstTime" indiquant si l’utilisateur n’a pas défini de mot de passe
    return this.authService.googleLogin(email, name, picture);
  }

  // Nouvel endpoint pour définir le mot de passe (première authentification)
  @Post('set-password')
  async setPassword(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.setPassword(email, password);
  }
}
