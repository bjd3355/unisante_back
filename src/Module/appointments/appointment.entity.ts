import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId
} from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';

// Définition de l'enum pour le statut du rendez-vous
export enum AppointmentStatus {
  SCHEDULED = 'confirmer', // Programmé
  PENDING = 'en attente',     // En attente
  REFUSED = 'refuser',     // Refusé
  POSTPONED = 'reporter',     // Reporter
}

export enum AppointmentType {
  PRESENTIEL = 'Presentiel', // Présentiel
  TELECOMMUNICATION = 'Teleconsultation',// Téléconsultation
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  // Précision du type 'date' pour le stockage de la date
  @Column({ type: 'date' })
  date: Date;

  // Précision du type 'time' pour le stockage de l'heure
  @Column({ type: 'time' })
  time: string;

  // Utilisation de l'enum pour la colonne status avec une valeur par défaut
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.PRESENTIEL,
  })
  type: AppointmentType;

  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  doctor: Doctor;

  @RelationId((appointment: Appointment) => appointment.doctor)
  doctorId: number;

  @ManyToOne(() => Patient, patient => patient.appointments)
  patient: Patient;

  @RelationId((appointment: Appointment) => appointment.patient)
  patientId: number;
}
