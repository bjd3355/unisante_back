export class CreateMessageDto {
    sender: 'patient' | 'assistance';
    text: string;
    patientId: number;
  }
  