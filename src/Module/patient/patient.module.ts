import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 🔹 Import du guard

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    JwtModule.register({
      secret: 'Unisante-NotreEquipe', // 🔹 Assure-toi que la clé correspond
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [PatientController],
  providers: [PatientService, JwtAuthGuard], // 🔹 Ajouter JwtAuthGuard ici
})
export class PatientModule {}
