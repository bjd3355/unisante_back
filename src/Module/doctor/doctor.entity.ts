// src/doctor/doctor.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Specialty } from '../specialty/specialty.entity';

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

  @ManyToOne(() => Specialty, (specialty) => specialty.doctors)
  specialty: Specialty;
}
