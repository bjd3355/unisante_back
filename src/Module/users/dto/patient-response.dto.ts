// patient-response.dto.ts
import { Expose } from 'class-transformer';

export class PatientResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  birthDate: Date;

  @Expose()
  phoneNumber: string;
}
