import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'Unisante-NotreEquipe',
      signOptions: { expiresIn: '1h' }, // Le token expire après 1h
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
