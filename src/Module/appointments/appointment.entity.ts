import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

// Définition de l'enum pour le statut du rendez-vous
export enum AppointmentStatus {
  SCHEDULED = 'scheduled', // Programmé
  PENDING = 'pending',     // En attente
  REFUSED = 'refused',     // Refusé
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  // Référence au médecin (User avec role DOCTOR)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  // Référence au patient (User avec role PATIENT)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  date: Date;

  @Column()
  time: string;

  // Utilisation de l'enum pour la colonne status avec une valeur par défaut
  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;
}
