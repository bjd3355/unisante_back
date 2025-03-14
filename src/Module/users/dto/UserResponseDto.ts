// user-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { PatientResponseDto } from './patient-response.dto';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  // On inclut le patient, qui lui-même ne contient pas de référence circulaire
  @Expose()
  @Type(() => PatientResponseDto)
  patient?: PatientResponseDto;
}
