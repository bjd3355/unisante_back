import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pharmacy } from './pharmacy.entity';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@Injectable()
export class PharmaciesService {
  constructor(
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,
  ) {}

  findAll(): Promise<Pharmacy[]> {
    return this.pharmacyRepository.find();
  }

  async findOne(id: number): Promise<Pharmacy> {
    const pharmacy = await this.pharmacyRepository.findOneBy({ id });
    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with id ${id} not found`);
    }
    return pharmacy;
  }

  async create(createPharmacyDto: CreatePharmacyDto): Promise<Pharmacy> {
    const newPharmacy = this.pharmacyRepository.create(createPharmacyDto);
    return this.pharmacyRepository.save(newPharmacy);
  }

  async update(id: number, updatePharmacyDto: UpdatePharmacyDto): Promise<Pharmacy> {
    const pharmacy = await this.findOne(id);
    Object.assign(pharmacy, updatePharmacyDto);
    return this.pharmacyRepository.save(pharmacy);
  }

  async remove(id: number): Promise<void> {
    const pharmacy = await this.findOne(id);
    await this.pharmacyRepository.remove(pharmacy);
  }
}
