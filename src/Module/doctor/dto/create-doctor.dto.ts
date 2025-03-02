import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  availability: boolean;

  @IsNumber()
  specialtyId: number; // Pour lier à la table Specialty
}
