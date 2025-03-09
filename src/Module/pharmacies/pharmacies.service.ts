import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pharmacy } from './pharmacy.entity';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,
  ) {}

  async findAll(): Promise<Pharmacy[]> {
    return await this.pharmacyRepository.find();
  }

  async getFirstTwoPharmacies(): Promise<Pharmacy[]> {
    return this.pharmacyRepository.find({ take: 2 });
  }

  async findOne(id: number): Promise<Pharmacy> {
    const pharmacy = await this.pharmacyRepository.findOne({ where: { id } });
    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with ID ${id} not found`);
    }
    return pharmacy;
  }

  async create(createPharmacyDto: CreatePharmacyDto): Promise<Pharmacy> {
    const pharmacy = this.pharmacyRepository.create(createPharmacyDto);
    return await this.pharmacyRepository.save(pharmacy);
  }

  async update(id: number, updatePharmacyDto: UpdatePharmacyDto): Promise<Pharmacy> {
    const pharmacy = await this.findOne(id);
    Object.assign(pharmacy, updatePharmacyDto);
    return await this.pharmacyRepository.save(pharmacy);
  }

  async remove(id: number): Promise<void> {
    const pharmacy = await this.findOne(id);
    await this.pharmacyRepository.remove(pharmacy);
  }
}
