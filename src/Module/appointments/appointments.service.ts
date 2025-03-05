import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find();
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
    return appointment;
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Récupération du médecin
    const doctor = await this.userRepository.findOne({ where: { id: createAppointmentDto.doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${createAppointmentDto.doctorId} not found`);
    }
    // Récupération du patient
    const patient = await this.userRepository.findOne({ where: { id: createAppointmentDto.patientId } });
    if (!patient) {
      throw new NotFoundException(`Patient with id ${createAppointmentDto.patientId} not found`);
    }

    const newAppointment = this.appointmentRepository.create({
      doctor,
      patient,
      date: createAppointmentDto.date,
      time: createAppointmentDto.time,
      status: createAppointmentDto.status || AppointmentStatus.PENDING,
    });

    return await this.appointmentRepository.save(newAppointment);
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }
}
