// src/specialty/specialty.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';

@Entity('specialties')
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => Doctor, (doctor) => doctor.specialty)
  doctors: Doctor[];
}
