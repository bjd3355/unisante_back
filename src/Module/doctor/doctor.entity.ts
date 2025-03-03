import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Specialty } from '../specialty/specialty.entity';
import { User } from '../users/user.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'boolean', default: false })
  availability: boolean;

  @ManyToOne(() => Specialty, (specialty) => specialty.doctors, { onDelete: 'CASCADE' })
  specialty: Specialty;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // Spécifie le nom de la colonne FK
  user: User;
}
