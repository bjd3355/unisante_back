import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from './specialty.entity';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  findAll(): Promise<Specialty[]> {
    return this.specialtyRepository.find();
  }

  async findOne(id: number): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findOneBy({ id });
    if (!specialty) {
      throw new NotFoundException(`Specialty with id ${id} not found`);
    }
    return specialty;
  }

  async create(createSpecialtyDto: CreateSpecialtyDto): Promise<Specialty> {
    const newSpecialty = this.specialtyRepository.create(createSpecialtyDto);
    return this.specialtyRepository.save(newSpecialty);
  }

  async update(id: number, updateSpecialtyDto: UpdateSpecialtyDto): Promise<Specialty> {
    const specialty = await this.findOne(id);
    Object.assign(specialty, updateSpecialtyDto);
    return this.specialtyRepository.save(specialty);
  }

  async remove(id: number): Promise<void> {
    const specialty = await this.findOne(id);
    await this.specialtyRepository.remove(specialty);
  }
}
