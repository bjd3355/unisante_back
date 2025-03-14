import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ Import du module de config
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { UsersModule } from '../Module/users/users.module';
import { AppointmentsModule } from '../Module/appointments/appointments.module';
import { PharmaciesModule } from '../Module/pharmacies/pharmacies.module';
import { DoctorModule } from '../Module/doctor/doctor.module';
import { PatientModule } from '../Module/patient/patient.module';
import { SpecialtyModule } from '../Module/specialty/specialty.module';
import { AuthModule } from '../Module/auth/auth.module';
import { MailModule } from '../Module/mail/mail.module';
import { MessagesModule } from '../Module/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Charger le fichier .env
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost', // 🔄 Valeur par défaut
      port: parseInt(process.env.DB_PORT || '3306', 10), // 🔄 Convertir en nombre
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'unisante_db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),    
    UsersModule,
    AppointmentsModule,
    PharmaciesModule,
    DoctorModule,
    PatientModule,
    SpecialtyModule,
    MailModule,
    MessagesModule,
    AuthModule, // ✅ Ajout du module d'authentification
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
