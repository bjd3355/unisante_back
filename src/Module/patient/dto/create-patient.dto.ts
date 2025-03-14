import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import {Gender, BloodGroup} from '../patient.entity';
export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  adresse: string;

  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;
  
  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
