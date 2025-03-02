import { AppointmentStatus } from '../appointment.entity';

export class UpdateAppointmentDto {
  doctorId?: number;
  patientId?: number;
  date?: Date;
  time?: string;
  status?: AppointmentStatus;
}
