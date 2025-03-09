import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointments.service';
import { AppointmentController } from './appointments.controller';
import { User } from '../users/user.entity'; // Assurez-vous que le chemin est correct

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User])
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentsModule {}
