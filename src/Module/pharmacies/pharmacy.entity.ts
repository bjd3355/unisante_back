import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pharmacies')
export class Pharmacy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;
}
