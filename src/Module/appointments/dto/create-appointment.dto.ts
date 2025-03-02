import { AppointmentStatus } from '../appointment.entity';

export class CreateAppointmentDto {
  doctorId: number;
  patientId: number;
  date: Date;
  time: string;
  status?: AppointmentStatus; // Optionnel, par défaut 'pending' dans l'entité
}
