import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { hostname } from 'os';
import { UsersModule } from './Module/users/users.module';
import { AppointmentsModule } from './Module/appointments/appointments.module';
import { PharmaciesModule } from './Module/pharmacies/pharmacies.module';
import { DoctorModule } from './Module/doctor/doctor.module';
import { PatientModule } from './Module/patient/patient.module';
import { SpecialtyModule } from './Module/specialty/specialty.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: "root",
      password: '',
      database: 'unisante_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,

    }),
    UsersModule,
    AppointmentsModule,
    PharmaciesModule,
    DoctorModule,
    PatientModule,
    SpecialtyModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
