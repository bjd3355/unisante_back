import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Specialty } from '../specialty/specialty.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Specialty]),
    AuthModule,  // 🔹 Ajout du module d'authentification
    JwtModule.register({}) // 🔹 S'assurer que JwtModule est bien disponible
  ],
  providers: [DoctorService, JwtAuthGuard], // 🔹 Ajout du guard si nécessaire
  controllers: [DoctorController],
  exports: [DoctorService],
})
export class DoctorModule {}
