import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';
import { CreateMessageDto } from './messages.dto';
import { Patient } from '../patient/patient.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async getMessagesByPatient(patientId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { patient: { id: patientId } },
      order: { timestamp: 'ASC' },
      relations: ['patient'],
    });
  }

  async sendMessage(data: CreateMessageDto): Promise<Message> {
    const patient = await this.patientRepository.findOne({ where: { id: data.patientId } });
    if (!patient) throw new Error('Patient introuvable');

    const message = this.messageRepository.create({
      sender: data.sender,
      text: data.text,
      patient: patient,
    });

    return this.messageRepository.save(message);
  }
}
