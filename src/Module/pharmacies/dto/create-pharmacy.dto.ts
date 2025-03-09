import { IsString} from 'class-validator';
import { Column } from 'typeorm';
import {  pharmacyStatus } from '../pharmacy.entity';

export class CreatePharmacyDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  status: pharmacyStatus;

  @Column("double precision")
  latitude: number;

  @Column("double precision")
  longitude: number;

}
