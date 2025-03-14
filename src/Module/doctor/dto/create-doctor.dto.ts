import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsBoolean()
  availability: boolean;

  @IsNumber()
  specialtyId: number; // Pour lier à la table Specialty

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
