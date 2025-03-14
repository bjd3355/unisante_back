import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Specialty } from '../specialty/specialty.entity';
import { User } from '../users/user.entity';
import { Appointment } from '../appointments/appointment.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ default: true })
  availability: boolean;

  // Nouveau champ pour stocker l'image (URL ou chemin)
  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @ManyToOne(() => Specialty, (specialty) => specialty.doctors, { eager: true })
  specialty: Specialty;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  userId: number;


  // Relation vers les rendez-vous
  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];
}
