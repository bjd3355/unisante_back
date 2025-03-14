import { Injectable, UnauthorizedException, BadRequestException,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Patient } from '../patient/patient.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/dto/user-role.enum';
import { UserResponseDto } from '../users/dto/UserResponseDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async register(userDto: CreateUserDto): Promise<UserResponseDto> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
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

    // Sauvegarde de l'utilisateur
    const savedUser = await this.userRepository.save(user);

    // Transformation de l'entité en DTO pour exclure les propriétés circulaires ou sensibles
    const userResponse = plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
    return userResponse;
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

  async resetPassword({ email, newPassword }: ResetPasswordDto): Promise<any> {

    // Recherche de l’utilisateur
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Sauvegarde dans la table "users"
    await this.userRepository.save(user);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async googleLogin(email: string, name: string, picture?: string): Promise<{ accessToken: string, firstTime: boolean }> {
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Extraction des prénoms et noms depuis le nom complet
      const [firstName, lastName] = name.split(' ');
      user = this.userRepository.create({
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        password: '', // Aucun mot de passe défini lors de la création via Google
        role: UserRole.PATIENT,
        image: picture || undefined, // Utilise undefined si aucune image n'est fournie
      });
      user = await this.userRepository.save(user);

      if (user.role === UserRole.PATIENT) {
        const newPatient = new Patient();
        newPatient.user = user;
        newPatient.firstName = user.firstName;
        newPatient.lastName = user.lastName;
        newPatient.email = user.email;
        newPatient.image = user.image || '';
        await this.patientRepository.save(newPatient);
      }
    }

    // Vérifie si c'est la première connexion (mot de passe non défini)
    const firstTime = !user.password || user.password === '';
    const payload = { email: user.email, role: user.role, id: user.id };
    const secretKey = 'Unisante-NotreEquipe';
    const accessToken = this.jwtService.sign(payload, { secret: secretKey });

    return { accessToken, firstTime };
  }

  async setPassword(email: string, password: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    if (user.password && user.password !== '') {
      throw new BadRequestException('Mot de passe déjà défini');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
    return { message: 'Mot de passe mis à jour avec succès' };
  }
}
