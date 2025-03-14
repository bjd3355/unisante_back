import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateDoctorDto {
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
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsNumber()
  specialtyId?: number;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address: string;

  // Nouveau champ pour l'image
  @IsOptional()
  @IsString()
  image?: string;
}
