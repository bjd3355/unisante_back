export class PatientResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date;
    phoneNumber: string;
  }
  
  export class UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    patient?: PatientResponseDto;
  }
  