import { IsString, IsOptional } from 'class-validator';
import { Column } from 'typeorm';
import {  pharmacyStatus } from '../pharmacy.entity';

export class UpdatePharmacyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  status: pharmacyStatus;

  @Column("double precision")
    latitude: number;
  
  @Column("double precision")
  longitude: number;
}
