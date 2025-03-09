import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum pharmacyStatus {
  OUVERT = 'Ouvert', // Ouvert
  JOUR = 'Jour',     // Jour
  NUIT = 'Nuit',     // Nuit
  GARDE = 'Garde',     // Garde
}

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

  @Column({
      type: 'enum',
      enum: pharmacyStatus,
      default: pharmacyStatus.OUVERT,
    })
  status: pharmacyStatus;

  @Column("double precision")
  latitude: number;

  @Column("double precision")
  longitude: number;
    
}
