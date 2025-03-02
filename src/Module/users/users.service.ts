import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

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

  async createUser(createUserDto: CreateUserDto): Promise<User> {

    const { firstName, lastName, email, password, role } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

  
    const userData = {
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword, 
    };

    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    const updatedData: Partial<User> = { ...updateUserDto };

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
