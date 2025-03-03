import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email: username } });
    return user ?? undefined;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password, role } = createUserDto;
    
    // Vérifier si l'email est déjà utilisé
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }

    // Générer un salt et hasher le mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Mapper les propriétés du DTO vers l'entité et caster le rôle en UserRole
    const userData: Partial<User> = {
      firstName: firstName, // "prenom" du DTO devient "firstName" dans l'entité
      lastName: lastName,     // "nom" du DTO devient "lastName"
      email,
      password: hashedPassword,
      role: role ? role as UserRole : UserRole.PATIENT, // rôle par défaut Patient si non fourni
    };

    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    // Préparer les données mises à jour et caster le rôle si fourni
    const updatedData: Partial<User> = {
      ...updateUserDto,
      role: updateUserDto.role ? updateUserDto.role as UserRole : undefined,
    };

    // Si le DTO utilise "prenom" et "nom", on les mappe vers firstName et lastName
    if ((updateUserDto as any).prenom) {
      updatedData.firstName = (updateUserDto as any).prenom;
      delete (updatedData as any).prenom;
    }
    if ((updateUserDto as any).nom) {
      updatedData.lastName = (updateUserDto as any).nom;
      delete (updatedData as any).nom;
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updatedData.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    Object.assign(user, updatedData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }
}
