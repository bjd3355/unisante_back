import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Patient } from '../patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['doctor', 'patient'],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ where: { id }, relations: ['doctor', 'patient'] });
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
    return appointment;
  }

  async getAppointmentsByPatient(patientId: string) {
    return this.appointmentRepository.find({
      where: { patient: { id: parseInt(patientId, 10) } },
      relations: ['doctor', 'patient'],
    });
  }

  async getAppointmentsByDoctor(doctorId: string) {
    return this.appointmentRepository.find({
      where: { doctor: { id: parseInt(doctorId, 10) } },
      relations: ['doctor', 'patient'],
    });
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const doctor = await this.doctorRepository.findOne({ where: { id: createAppointmentDto.doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${createAppointmentDto.doctorId} not found`);
    }

    const patient = await this.patientRepository.findOne({ where: { id: createAppointmentDto.patientId } });

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
