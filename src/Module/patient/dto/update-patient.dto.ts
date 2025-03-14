import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import {Gender, BloodGroup} from '../patient.entity'

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;
  
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  adresse: string;
  
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // Nouveau champ pour l'image
  @IsOptional()
  @IsString()
  image?: string;
}
