import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string, role: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    if (user.role !== role) {
      throw new UnauthorizedException('Rôle invalide');
    }

    const payload = { email: user.email, role: user.role };

    // Définir la clé secrète directement dans le code
    const secretKey = 'Unisante-NotreEquipe'; 

    const accessToken = this.jwtService.sign(payload, {
      secret: secretKey, // Utilisation de la clé secrète définie directement dans le code
    });

    return { accessToken };
  }
}
