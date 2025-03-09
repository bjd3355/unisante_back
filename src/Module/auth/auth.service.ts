import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Patient } from '../patient/patient.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/dto/user-role.enum';
import { UserResponseDto } from '../users/dto/UserResponseDto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,

    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async register(userDto: CreateUserDto): Promise<User> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOne({
        where: { email: userDto.email }
    });

    if (existingUser) {
        throw new BadRequestException('Cet email est déjà utilisé.');
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Création de l'utilisateur
    const user = this.userRepository.create({
        ...userDto,
        password: hashedPassword,
    });

    if (!userDto.role || userDto.role === UserRole.PATIENT) {
      user.role = UserRole.PATIENT;

      const patient = new Patient();
      patient.user = user;
      patient.firstName = userDto.firstName;
      patient.lastName = userDto.lastName;
      patient.email = userDto.email;

      const savedPatient = await this.patientRepository.save(patient);
      user.patient = savedPatient;
    }

    return await this.userRepository.save(user);
  }

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

    // Ajout de l'ID dans le payload du token
    const payload = { email: user.email, role: user.role, id: user.id };

    // Définir la clé secrète directement dans le code
    const secretKey = 'Unisante-NotreEquipe'; 

    const accessToken = this.jwtService.sign(payload, {
      secret: secretKey,
    });

    return { accessToken };
  }
  
}
