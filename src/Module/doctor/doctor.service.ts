import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async findAll(): Promise<Doctor[]> {
    return await this.doctorRepository.find();
  }

  async findByUserId(userId: number): Promise<Doctor> {
      const Doctor = await this.doctorRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      if (!Doctor) {
        throw new NotFoundException(`Aucun Doctor trouvé pour l'utilisateur d'id ${userId}`);
      }
      return Doctor;
    }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }
    return doctor;
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const newDoctor = this.doctorRepository.create(createDoctorDto);
    return await this.doctorRepository.save(newDoctor);
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);
    Object.assign(doctor, updateDoctorDto);
    return await this.doctorRepository.save(doctor);
  }

  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.remove(doctor);
  }
}
