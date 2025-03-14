import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Appointment } from '../appointments/appointment.entity';
import { Message } from '../messages/messages.entity';

export enum Gender {
  HOMME = 'homme',
  FEMME = 'femme',
  NONDEFINI = 'non defini',
}

export enum BloodGroup {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'enum', enum: Gender, default: Gender.NONDEFINI })
  gender: Gender; 

  @Column({ type: 'varchar', length: 100 })
  adresse: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  // Nouveau champ pour stocker l'image (URL ou chemin)
  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  // Nouveau champ pour le groupe sanguin
  @Column({ type: 'enum', enum: BloodGroup, nullable: true })
  bloodGroup: BloodGroup;

  @OneToOne(() => User, (user) => user.patient, { cascade: ['insert'] })
  @JoinColumn()
  user: User;

  @OneToMany(() => Message, (message) => message.patient)
  messages: Message[];

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];
}
