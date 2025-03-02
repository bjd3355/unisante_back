import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Specialty } from '../specialty/specialty.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  findAll(): Promise<Doctor[]> {
    // Pour charger la relation "specialty"
    return this.doctorRepository.find({
      relations: ['specialty'],
    });
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['specialty'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }
    return doctor;
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const { firstName, lastName, availability, specialtyId } = createDoctorDto;

    // Vérifier la spécialité
    const specialty = await this.specialtyRepository.findOneBy({ id: specialtyId });
    if (!specialty) {
      throw new NotFoundException(`Specialty with id ${specialtyId} not found`);
    }

    const newDoctor = this.doctorRepository.create({
      firstName,
      lastName,
      availability,
      specialty,
    });

    return this.doctorRepository.save(newDoctor);
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);

    // Mise à jour de la spécialité si un specialtyId est fourni
    if (updateDoctorDto.specialtyId) {
      const specialty = await this.specialtyRepository.findOneBy({
        id: updateDoctorDto.specialtyId,
      });
      if (!specialty) {
        throw new NotFoundException(
          `Specialty with id ${updateDoctorDto.specialtyId} not found`,
        );
      }
      doctor.specialty = specialty;
    }

    // Mise à jour des autres champs
    if (updateDoctorDto.firstName !== undefined) {
      doctor.firstName = updateDoctorDto.firstName;
    }
    if (updateDoctorDto.lastName !== undefined) {
      doctor.lastName = updateDoctorDto.lastName;
    }
    if (updateDoctorDto.availability !== undefined) {
      doctor.availability = updateDoctorDto.availability;
    }

    return this.doctorRepository.save(doctor);
  }

  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.remove(doctor);
  }
}
