import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Appointment } from '../appointments/appointment.entity';

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

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @OneToOne(() => User, (user) => user.patient, { cascade: ["insert"] })
  @JoinColumn()
  user: User;

   // Relation vers les rendez-vous
   @OneToMany(() => Appointment, appointment => appointment.patient)
   appointments: Appointment[];

}
